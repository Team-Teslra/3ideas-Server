const { answers, users, user_like } = require('../../models');

module.exports = {
  // ? 답변글 등록 요청 ( /answer/질문글id )
  post: (req, res) => {
    const { askId } = req.params;
    const { username, contents } = req.body;

    // * 위 세 개 변수 이상하거나 없을 경우 에러 보내기.
    if (!Number(askId)) {
      return res.status(400).json('bad request!');
    }
    if (!username || !contents) {
      return res.status(400).json('neither username nor comment was fulfilled!');
    }

    users
      .findOne({ where: { userName: username } })
      .then((user) => {
        // * 없는 유저일 경우 에러 보내기
        if (!user) {
          return res.status(404).json('invalid user!');
        }
        // * answers DB에 답변을 새로 생성하고 답변 id를 보낸다.
        answers.create({ contents, user_id: user.id, question_id: askId }).then((result) => {
          if (!result) {
            return res.status(400).json('failed to post new answer');
          }
          const { id } = result.dataValues;
          res.status(201).json({ id: id });
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  // ? 답변글 보기 요청 ( /answer/답변글id )
  get: (req, res) => {
    const { answerId } = req.params;
    if (!Number(answerId)) {
      return res.status(400).json('bad request!');
    }

    answers
      .findOne({
        where: { id: answerId },
        include: [
          { model: user_like, include: { model: users, attributes: ['userName'] } },
          { model: users, attributes: ['userName'] },
        ], //* left-join이 기본이다
      })
      .then((answer) => {
        if (!answer) {
          // ? answer가 없을때
          return res.status(404).json('no answers!');
        }
        // ? answer가 있으면 보내준다.
        // ! (answers의 user_id = users의 id)인 users의 userName을 보내준다.
        // console.log('--------------------', answer.user_likes[0].user.userName);
        // console.log('--------------------', answer.user_likes[1].user.userName);
        const { userName } = answer.user;
        const like = answer.user_likes.reduce((acc, val) => {
          acc.push({ username: val.user.userName });
          return acc;
        }, []);
        const { id, contents, answerFlag, createdAt, updatedAt } = answer;
        return res.status(200).json({ id, username: userName, contents, answerFlag, like, createdAt, updatedAt });
      })
      .catch((err) => res.status(500).send(err));
  },

  // ? 답변글 수정 ( /answer/답변글id )
  patch: (req, res) => {
    const { answerId } = req.params;
    const { contents } = req.body;

    if (!Number(answerId)) {
      return res.status(400).json('bad request!');
    }
    if (!contents) {
      return res.status(400).json('Please send patch data!');
    }

    const patchValues = {};
    if (contents) {
      patchValues.contents = contents;
    }

    answers
      .update(patchValues, { where: { id: answerId } })
      .then((result) => {
        if (!result) {
          return res.status(400).json('failed to update data!');
        }
        return res.status(200).json({ id: answerId });
      })
      .catch((err) => res.status(500).send(err));
  },

  // ? 답변글 삭제 ( /answer/답변글id )
  delete: (req, res) => {
    const { answerId } = req.params;

    if (!Number(answerId)) {
      return res.status(400).json('bad request!');
    }

    answers
      .destroy({ where: { id: answerId } })
      .then((result) => {
        // console.log(result, ' deleted');
        if (!result) {
          return res.status(422).json('invalid answer id');
        }

        return res.status(200).json(`answerId: ${answerId}'s answer deleted`);
      })
      .catch((err) => res.status(500).send(err));
  },
};
