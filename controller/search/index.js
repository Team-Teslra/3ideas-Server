const { questions, answers, users } = require('../../models');
const { Sequelize } = require('sequelize');
const { or, like } = Sequelize.Op;

module.exports = {
  //? 검색 기능 ( /search?q=키워드 )
  get: async (req, res) => {
    let keyword = req.query.q;
    keyword = keyword.trim(); //trim으로 앞뒤 공백 제거
    if (!keyword.length) {
      //! 키워드에 공백만 존재
      return res.status(400).json('invalid target');
    }

    keyword = keyword.replace(/\s\s+/gi, ' '); //target 사이에 공백이 2개 이상 존재 > 하나의 공백으로 변환

    try {
      //* 1. questions에서 찾기 => 찾는 조건 저장
      const questionSearchCondition = [{ contents: { [like]: `%${keyword}%` } }, { title: { [like]: `%${keyword}%` } }];

      //* answers에서 찾기 => questionSearchCondition에 question id 저장
      await answers
        .findAll({
          attributes: ['question_id'],
          where: {
            contents: { [like]: `%${keyword}%` },
          },
        })
        .then((result) => {
          // console.log(result);
          result = result.forEach((value) => {
            const id = value.question_id;
            if (!questionSearchCondition.includes({ id })) {
              questionSearchCondition.push({ id });
            }
          });
          return result;
        });

      //? 찾은 질문글 id들 토대로 질문글에서 response data에 맞게 형식 바꿔서 저장
      const searchResults = await questions
        .findAll({
          attributes: ['id', 'title', 'questionFlag', 'createdAt', 'contents'],
          include: [
            {
              model: users,
              attributes: ['userName'],
            },
            {
              required: false,
              model: answers,
              attributes: ['id', 'contents'],
              where: { contents: { [like]: `%${keyword}%` } },
            },
          ],
          where: {
            [or]: questionSearchCondition,
          },
        })
        .then(async (asks) => {
          asks = await Promise.all(
            asks.map(async (value) => {
              const ask = {};
              Object.assign(ask, value.dataValues);

              ask.username = ask.user.userName;
              delete ask.user;

              ask.commentsCount = await answers.count({ where: { question_id: ask.id } });

              return ask;
            }),
          );
          return asks;
        });

      return res.status(200).json(searchResults);
    } catch (err) {
      return res.status(500).json(err);
    }
  },
};
