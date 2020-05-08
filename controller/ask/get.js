const { users, questions, category_question, answers } = require('../../models');

//? 질문글 보기 요청 ( /ask/질문글id )
module.exports = async (req, res) => {
  const { askId } = req.params;
  if (!parseInt(askId)) {
    //! askId가 숫자가 아님
    return res.status(400).json('invalid API parameter');
  }

  try {
    const findQuestion = await questions.findOne({
      where: { id: askId },
      include: [
        {
          model: users,
          attributes: ['userName'],
        },
        {
          model: answers,
          attributes: ['id'],
        },
        {
          model: category_question,
          attributes: ['id'],
          include: {
            model: categories,
            attributes: ['categoryName'],
          },
        },
      ],
    });

    if (!findQuestion) {
      //! 해당 id의 질문글이 없음
      return res.status(404).json('invalid ask id');
    }

    const { id, title, contents, questionFlag, createdAt, updatedAt } = findQuestion;
    const username = findQuestion.user.userName;
    const commentsCount = findQuestion.answers.length;
    const categories = findQuestion.category_questions.map((element) => {
      const { categoryName } = element.category;
      return { categoryName };
    });

    return res
      .status(200)
      .json({ id, title, contents, username, questionFlag, createdAt, updatedAt, commentsCount, categories });
  } catch (err) {
    return res.status(500).json(err);
  }
};
