const { user_like, users, answers } = require('../../models');

module.exports = {
  //? 좋아요 요청( /like/답변글id )
  post: async (req, res) => {
    const { answerId } = req.params;
    const { username } = req.body;

    if (!Number(answerId)) {
      return res.status(400).json('invalid API');
    }

    try {
      const answer = await answers.findOne({ where: { id: answerId } });
      if (!answer) {
        return res.status(400).json('invalid answer id');
      }

      const user = await users.findOne({ where: { userName: username } });
      if (!user) {
        return res.status(400).json('invalid username');
      }

      const [, created] = await user_like.findOrCreate({ where: { user_id: user.id, answer_id: answerId } });

      if (!created) {
        return res.status(422).json('already liked');
      }

      return res.status(200).json(`answerId: ${answerId}, username: ${username} add like complete`);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //? 좋아요 취소( /like/답변글id )
  delete: async (req, res) => {
    const { answerId } = req.params;
    const { username } = req.body;

    if (!Number(answerId)) {
      return res.status(400).json('invalid API');
    }

    try {
      const answer = await answers.findOne({ where: { id: answerId } });
      if (!answer) {
        return res.status(400).json('invalid answer id');
      }

      const user = await users.findOne({ where: { userName: username } });
      if (!user) {
        return res.status(400).json('invalid username');
      }

      const destroyedRows = await user_like.destroy({ where: { user_id: user.id, answer_id: answerId } });

      if (!destroyedRows) {
        return res.status(422).json('invalid username or answerId');
      }

      return res.status(200).json(`answerId: ${answerId}, username: ${username} delete like complete`);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
