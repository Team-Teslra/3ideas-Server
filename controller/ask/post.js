const { users, categories, questions, category_question } = require('../../models');

//? 질문글 등록 요청 ( /ask )
module.exports = async (req, res) => {
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
};
