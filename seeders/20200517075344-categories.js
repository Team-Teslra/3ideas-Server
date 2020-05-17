'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('categories', [
      { categoryName: '미분류' },
      { categoryName: '교육, 학문' },
      { categoryName: '컴퓨터 통신' },
      { categoryName: '게임' },
      { categoryName: '엔터테인먼트, 예술' },
      { categoryName: '생활' },
      { categoryName: '건강' },
      { categoryName: '사회, 정치' },
      { categoryName: '경제' },
      { categoryName: '여행' },
      { categoryName: '스포츠, 레저' },
      { categoryName: '쇼핑' },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('categories', null, {});
  },
};
