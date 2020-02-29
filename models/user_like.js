'use strict';

module.exports = (sequelize, DataTypes) => {
  const user_like = sequelize.define(
    'user_like',
    {
      answer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: 'cascade',
      },
    },
    {
      tableName: 'user_like',
    },
  );

  user_like.associate = function(models) {
    models.user_like.belongsTo(models.users, {
      foreignKey: 'user_id',
    });
    models.user_like.belongsTo(models.answers, {
      foreignKey: 'answer_id',
    });
  };
  return user_like;
};
