'use strict';

module.exports = (sequelize, DataTypes) => {
  const categories = sequelize.define(
    'categories',
    {
      categoryName: {
        type: DataTypes.STRING,
      },
    },
    {},
  );

  categories.associate = function(models) {
    models.categories.hasMany(models.category_question, {
      foreignKey: 'category_id',
      onDelete: 'cascade',
      hooks: true,
    });
  };
  return categories;
};
