'use strict';

module.exports = (sequelize, DataTypes) => {
  const category_question = sequelize.define(
    'category_question',
    {
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
      },
    },
    {
      tableName: 'category_question',
    },
  );

  category_question.associate = function(models) {
    models.category_question.belongsTo(models.questions, {
      foreignKey: 'question_id',
    });
    models.category_question.belongsTo(models.categories, {
      foreignKey: 'category_id',
    });
  };
  return category_question;
};
