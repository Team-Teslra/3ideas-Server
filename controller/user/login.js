const { users } = require('../../models');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = {
  post: async (req, res) => {
    const { username } = req.body;

    if (!username) {
      //! username이 비어있음
      return res.status(400).json('please insert username');
    } else if (!req.body.password) {
      //! password가 비어있음
      return res.status(400).json('please insert password');
    }

    const password = crypto
      .pbkdf2Sync(req.body.password, username + process.env.PASS_SALT, 100000, 64, 'sha512')
      .toString('hex');

    try {
      const findUser = await users.findOne({ where: { userName: username } });

      //? username 존재여부 확인
      if (!findUser) {
        //! username 존재하지 않음
        return res.status(404).json('invalid username!');
      }

      //? password 일치 확인
      if (findUser.password !== password) {
        //! password 불일치
        return res.status(404).json('invalid password!');
      }

      //? login
      const token = jwt.sign(
        {
          userid: findUser.id,
          username: findUser.userName,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '1h',
        },
      );

      res.cookie('token', token);
      return res.status(200).json({ username: findUser.userName });
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
