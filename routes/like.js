const express = require('express');
const { verifyToken } = require('../middlewares');
const router = express.Router();

const { likeController } = require('../controller');

router.post('/:answerId', verifyToken, likeController.post);
router.delete('/:answerId', verifyToken, likeController.delete);

module.exports = router;
