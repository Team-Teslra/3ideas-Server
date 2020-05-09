const { categories } = require('../../models');

//? 카테고리들의 목록을 받아옴 ( /category )
module.exports = async (req, res) => {
  try {
    const findCategories = await categories.findAll({ attributes: ['categoryName'] });

    if (!findCategories.length) {
      return res.status(404).json('categories are empty');
    }
    return res.status(200).json(findCategories);
  } catch (err) {
    return res.status(500).json(err);
  }
};
