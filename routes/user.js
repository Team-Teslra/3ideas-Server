const express = require('express');
const { verifyToken, checkTokenExist } = require('../middlewares');
const router = express.Router();
// console.log(typeof verifyToken, verifyToken);

const { userController } = require('../controller');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/logout', verifyToken, userController.logout);
router.get('/:userName', userController.get);
router.patch('/:userName', verifyToken, userController.patch);
router.delete('/', verifyToken, userController.delete);

module.exports = router;
