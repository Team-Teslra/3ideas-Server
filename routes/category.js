const express = require('express');
const router = express.Router();

const { categoryController } = require('../controller');

//GET: /
router.get('/', categoryController.get);
//GET: /카테고리명
router.get('/:categoryName', categoryController.list);

module.exports = router;
