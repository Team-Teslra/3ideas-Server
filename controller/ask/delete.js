const { questions } = require('../../models');

//? 질문글 삭제 요청 ( /ask/질문글id )
module.exports = async (req, res) => {
  const askId = req.params.askId;
  if (!parseInt(askId)) {
    //! askId가 숫자가 아님
    return res.status(400).json('invalid API parameter');
  }

  try {
    const destroyedRows = await questions.destroy({ where: { id: askId } });
    if (!destroyedRows) {
      return res.status(422).json('invalid ask id');
    }

    return res.status(200).json(`id: ${askId} delete complete`);
  } catch (err) {
    return res.status(500).json(err);
  }
};
