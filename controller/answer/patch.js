const { answers } = require('../../models');

// ? 답변글 수정 ( /answer/답변글id )
module.exports = async (req, res) => {
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

  try {
    const updateResult = await answers.update(patchValues, { where: { id: answerId } });

    if (!updateResult) {
      return res.status(400).json('failed to update data!');
    }
    return res.status(200).json({ id: answerId });
  } catch (err) {
    return res.status(500).json(err);
  }
};
