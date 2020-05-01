const { users, categories, questions, category_question, answers } = require('../../models');

module.exports = {
  //? 질문글 등록 요청 ( /ask )
  post: async (req, res) => {
    const { username, title, contents, categories: bodyCategories } = req.body;
    if (!username || !title || !contents || !bodyCategories) {
      //! username, title, contents, categories 중 하나라도 null이면 안 됨
      return res.status(400).json('Please send valid syntax');
    }

    const user = await users.findOne({ where: { userName: username } });

    //? username 존재여부 확인
    if (!user) {
      //! username이 존재하지 않음
      return res.status(404).json('invalid username!');
    }

    try {
      const categoryNameCheck = await Promise.all(
        bodyCategories.map(async (category) => {
          //? req.body의 categories가 유효한 형식인지 확인
          if (!category.categoryName) {
            //! categoryName이라는 키값이 없음
            return null;
          }
          if (Object.keys(category).length !== 1) {
            //! categoryName 말고 다른 키값이 존재함
            return null;
          }

          //? 유효한 카테고리명인지 확인
          const isExist = await categories.findOne({ where: category });

          // console.log({ isExist });
          if (!isExist) {
            //! 존재하지 않은 카테고리명
            return null;
          }
          return category;
        }),
      );

      if (categoryNameCheck.includes(null)) {
        return res.status(400).json('invalid categories type');
      }

      const user_id = user.id;

      const question = await questions.create({ title, contents, user_id });

      const question_id = question.id;

      await Promise.all(
        bodyCategories.map(async (categoryName) => {
          const category = await categories.findOne({
            attributes: ['id'],
            where: categoryName,
          });
          const category_id = category.id;

          await category_question.findOrCreate({ where: { category_id, question_id } });
        }),
      );

      //* 입력에 성공하면 새로 생성된 question의 id를 response로 보내줌
      return res.status(201).json({ id: question_id });
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  //? 질문글 보기 요청 ( /ask/질문글id )
  get: async (req, res) => {
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
  },

  //? 질문글 수정 요청 ( /ask/질문글id )
  patch: async (req, res) => {
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
  },

  //? 질문글 삭제 요청 ( /ask/질문글id )
  delete: async (req, res) => {
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
  },

  selection: require('./selection'),
};
