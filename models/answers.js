'use strict';

module.exports = (sequelize, DataTypes) => {
  const answers = sequelize.define(
    'answers',
    {
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answerFlag: {
        type: DataTypes.STRING,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
      },
      question_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
      },
    },
    {},
  );

  answers.associate = function(models) {
    models.answers.belongsTo(models.users, {
      foreignKey: 'user_id',
    });
    models.answers.belongsTo(models.questions, {
      foreignKey: 'question_id',
    });
    models.answers.hasMany(models.user_like, {
      foreignKey: 'answer_id',
      onDelete: 'cascade',
      hooks: true,
    });
  };
  return answers;
};
