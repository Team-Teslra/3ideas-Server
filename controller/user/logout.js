const { blacklist } = require('../../models');

module.exports = {
  post: async (req, res) => {
    const token = req.cookies.token;
    // console.log(token);

    try {
      //? blacklist에 토큰 추가
      const [, created] = await blacklist.create({ token });

      if (!created) {
        return res.status(422).json('already logout');
      }

      return res.status(200).json('logout complete, add blacklist complete');
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
