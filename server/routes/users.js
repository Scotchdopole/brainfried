const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');



router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/', userController.verifyToken, userController.getAllUsers);

router.get('/:id', userController.verifyToken, userController.getUserById);

router.put('/update/:id', userController.verifyToken, userController.updateUser);

router.delete('/delete/:id', userController.verifyToken, userController.deleteUser);

module.exports = router;