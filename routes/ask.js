const express = require('express');
const { verifyToken } = require('../middlewares');
const router = express.Router();

const { askController } = require('../controller');

router.post('/', verifyToken, askController.post);
router.get('/:askId', askController.get);
router.patch('/:askId', verifyToken, askController.patch);
router.delete('/:askId', verifyToken, askController.delete);
router.patch('/selection/:askId', verifyToken, askController.selection.patch);

module.exports = router;
