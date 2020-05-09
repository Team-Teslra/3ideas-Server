const { questions, categories, category_question, users, answers } = require('../../models');
const sequelize = require('sequelize');
const { or } = sequelize.Op;

//? 해당 카테고리에 속해있는 게시글 받아옴 ( /category/카테고리명 )
module.exports = async (req, res) => {
  const { categoryName } = req.params;

  try {
    const category_id = await categories
      .findOne({
        where: { categoryName },
      })
      .then((category) => {
        // console.log(category.dataValues);
        if (!category) {
          return null;
        }
        return category.id;
      });
    // console.log({ categoryName, category_id });

    if (!category_id) {
      return res.status(400).json('invalid category name');
    }

    const questionIds = await category_question
      .findAll({
        attributes: ['question_id'],
        where: { category_id },
      })
      .then((category_questions) => {
        category_questions = category_questions.map((value) => {
          const questionId = {};
          Object.assign(questionId, value.dataValues);

          questionId.id = questionId.question_id;
          delete questionId.question_id;

          return questionId;
        });
        return category_questions;
      });
    // console.log(questionIds);

    let asks = await questions.findAll({
      attributes: ['id', 'title', 'questionFlag', 'createdAt', 'contents'],
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
      where: {
        [or]: questionIds,
      },
    });

    asks = asks.map((value) => {
      const ask = {};
      Object.assign(ask, value.dataValues);

      ask.username = ask.user.userName;
      delete ask.user;

      ask.commentsCount = ask.answers.length;
      delete ask.answers;

      ask.categories = ask.category_questions.map((element) => {
        const { categoryName } = element.category;
        return { categoryName };
      });
      delete ask.category_questions;

      return ask;
    });

    return res.status(200).json(asks);
  } catch (err) {
    return res.status(500).json(err);
  }
};
