'use strict';

module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    'users',
    {
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      point: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      report: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {},
  );

  users.associate = function(models) {
    models.users.hasMany(models.questions, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    models.users.hasMany(models.answers, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
    models.users.hasMany(models.user_like, {
      foreignKey: 'user_id',
      onDelete: 'cascade',
      hooks: true,
    });
  };
  return users;
};
