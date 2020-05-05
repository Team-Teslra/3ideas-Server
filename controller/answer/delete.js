const { answers } = require('../../models');

// ? 답변글 삭제 ( /answer/답변글id )
module.exports = async (req, res) => {
  const { answerId } = req.params;

  if (!Number(answerId)) {
    return res.status(400).json('bad request!');
  }

  try {
    let deleteResult = await answers.destroy({ where: { id: answerId } });

    if (!deleteResult) {
      return res.status(422).json('invalid answer id');
    }

    return res.status(200).json(`answerId: ${answerId} deleted`);
  } catch (err) {
    return res.status(500).json(err);
  }
};
