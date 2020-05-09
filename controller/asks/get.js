//? 질문글 목록 요청( /asks )
const { questions, users, answers } = require('../../models');

module.exports = async (req, res) => {
  try {
    let asks = await questions.findAll({
      attributes: ['id', 'title', 'questionFlag', 'createdAt', 'contents'],
      include: [
        {
          model: users,
          attributes: ['userName'],
        },
        {
          model: answers,
          attributes: ['id'],
        },
      ],
    });

    asks = asks.map((value) => {
      const ask = {};
      Object.assign(ask, value.dataValues);

      ask.username = ask.user.userName;
      delete ask.user;

      ask.commentsCount = ask.answers.length;
      delete ask.answers;

      return ask;
    });

    return res.status(200).json(asks);
  } catch (err) {
    return res.status(500).json(err);
  }
};
