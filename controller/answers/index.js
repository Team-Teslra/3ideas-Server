const { answers, user_like } = require('../../models');

module.exports = {
  // ? 해당 질문의 답변글 id들 보내주기 ( /answers/질문글id )
  get: (req, res) => {
    // GET /:askId
    const target = req.params.askId;
    if (!Number(target)) {
      return res.status(400).json('bad request!');
    }

    answers
      .findAll({
        attributes: ['id', 'answerFlag'],
        where: { question_id: target },
        include: {
          model: user_like,
          attributes: ['id'],
        },
      })
      .then(result => {
        if (result.length === 0) {
          return res.status(404).json('no answers yet!');
        }

        const body = result.map(element => {
          // console.log(answer);
          const answer = Object.assign({}, element.dataValues);
          answer.like = answer.user_likes.length;
          delete answer.user_likes;

          return answer;
        });

        res.status(200).json(body);
      })
      .catch(err => res.status(400).send(err));
  },
};
