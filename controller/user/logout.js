const { blacklist } = require('../../models');

module.exports = {
  post: (req, res) => {
    const token = req.cookies.token;
    // console.log(token);

    //? blacklist에 토큰 추가
    blacklist
      .create({ token })
      .then(() => {
        res.status(200).json('logout complete, add blacklist complete');
      })
      .catch(err => res.status(400).send(err));
  },
};
