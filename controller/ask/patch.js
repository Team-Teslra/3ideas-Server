const { questions } = require('../../models');

//? 질문글 수정 요청 ( /ask/질문글id )
module.exports = async (req, res) => {
  const { askId } = req.params;
  if (!parseInt(askId)) {
    //! askId가 숫자가 아님
    return res.status(400).json('invalid API parameter');
  }

  const { title, contents } = req.body;
  if (!title && !contents) {
    //! title, contents, questionFlag 셋 다 없으면 안됨.
    return res.status(400).json('Please send patch data');
  }

  const patchValues = {};
  if (title) {
    patchValues.title = title;
  }
  if (contents) {
    patchValues.contents = contents;
  }

  try {
    const [affectedRows] = await questions.update(patchValues, { where: { id: askId } });
    // console.log(affectedRows);
    if (!affectedRows) {
      return res.status(400).json('fail to patch');
    }
    return res.status(200).json({ id: askId });
  } catch (err) {
    return res.status(500).json(err);
  }
};
