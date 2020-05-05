const { answers, user_like } = require('../../models');

// ? 해당 질문의 답변글 id들 보내주기 ( /answers/질문글id )
module.exports = async (req, res) => {
  // GET /:askId
  const target = req.params.askId;
  if (!Number(target)) {
    return res.status(400).json('bad request!');
  }

  try {
    const answer = await answers.findAll({
      attributes: ['id', 'answerFlag'],
      where: { question_id: target },
      include: {
        model: user_like,
        attributes: ['id'],
      },
    });

    if (answer.length === 0) {
      return res.status(404).json('no answers yet!');
    }

    const body = answer.map((element) => {
      // console.log(answer);
      const answer = Object.assign({}, element.dataValues);
      answer.like = answer.user_likes.length;
      delete answer.user_likes;

      return answer;
    });

    return res.status(200).json(body);
  } catch (err) {
    return res.status(500).json(err);
  }
};
