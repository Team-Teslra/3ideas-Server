const { users, user_like, answers } = require('../../models');

// ? 답변글 보기 요청 ( /answer/답변글id )
module.exports = async (req, res) => {
  const { answerId } = req.params;
  if (!Number(answerId)) {
    return res.status(400).json('bad request!');
  }

  try {
    const answer = await answers.findOne({
      where: { id: answerId },
      include: [
        { model: user_like, include: { model: users, attributes: ['userName'] } },
        { model: users, attributes: ['userName'] },
      ], //* left-join이 기본이다
    });

    if (!answer) {
      // ? answer가 없을때
      return res.status(404).json('no answers!');
    }
    // ? answer가 있으면 보내준다.
    // ! (answers의 user_id = users의 id)인 users의 userName을 보내준다.
    const { userName } = answer.user;
    const like = answer.user_likes.reduce((acc, val) => {
      acc.push({ username: val.user.userName });
      return acc;
    }, []);
    const { id, contents, answerFlag, createdAt, updatedAt } = answer;
    return res.status(200).json({ id, username: userName, contents, answerFlag, like, createdAt, updatedAt });
  } catch (err) {
    return res.status(500).json(err);
  }
};
