const { users, questions, answers } = require('../../models');

module.exports = {
  signup: require('./signup'),
  login: require('./login'),
  logout: require('./logout'),

  //? 회원정보 보기 요청 ( /user/:userName )
  get: async (req, res) => {
    const { userName } = req.params;

    try {
      const findUser = await users.findOne({
        attributes: ['id', 'userName', 'createdAt', 'point', 'report'],
        where: { userName },
        include: [
          {
            model: questions,
            attributes: ['id'],
          },
          {
            model: answers,
            attributes: ['id'],
          },
        ],
      });
      if (!findUser) {
        return res.status(400).json('invalid user name');
      }

      const body = findUser.dataValues;

      body.username = body.userName;
      delete body.userName;

      body.postCount = body.questions.length;
      delete body.questions;

      body.commentsCount = body.answers.length;
      delete body.answers;

      return res.status(200).json(body);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  delete: (req, res) => {
    res.status(200).json('user delete');
  },

  patch: (req, res) => {
    res.status(201).json('user fetch');
  },
};
