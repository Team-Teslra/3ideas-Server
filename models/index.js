'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
const { or } = Sequelize.Op;

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

sequelize.sync();

fs.readdirSync(__dirname)
  .filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.sync().then(() => {
  db.categories
    .findAll({
      where: {
        [or]: [
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
        ],
      },
    })
    .then(result => {
      // console.log(result);
      if (!result.length) {
        // console.log('empty');
        db.categories.bulkCreate([
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
      }
    });
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
