const { users, answers } = require('../../models');

// ? 답변글 등록 요청 ( /answer/질문글id )
module.exports = async (req, res) => {
  const { askId } = req.params;
  const { username, contents } = req.body;

  // * 위 세 개 변수 이상하거나 없을 경우 에러 보내기.
  if (!Number(askId)) {
    return res.status(400).json('bad request!');
  }
  if (!username || !contents) {
    return res.status(400).json('neither username nor comment was fulfilled!');
  }

  try {
    const user = await users.findOne({ where: { userName: username } });
    // * 없는 유저일 경우 에러 보내기
    if (!user) {
      return res.status(404).json('invalid user!');
    }

    // * answers DB에 답변을 새로 생성하고 답변 id를 보낸다.
    const newAnswer = await answers.create({ contents, user_id: user.id, question_id: askId });
    if (!newAnswer) {
      return res.status(400).json('failed to post new answer');
    }

    const { id } = newAnswer.dataValues;
    return res.status(201).json({ id: id });
  } catch (err) {
    return res.status(500).json(err);
  }
};
