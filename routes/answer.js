const express = require('express');
const { verifyToken } = require('../middlewares');
const router = express.Router();

const { answerController } = require('../controller');

router.post('/:askId', verifyToken, answerController.post);
router.get('/:answerId', answerController.get);
router.patch('/:answerId', verifyToken, answerController.patch);
router.delete('/:answerId', verifyToken, answerController.delete);

module.exports = router;
