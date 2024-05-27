const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

const { authenticateToken } = require('../middleware/auth')

// Create a user
router.post('/signup', userController.createUser);

// Read all users
router.get('/users', authenticateToken, userController.getAllUsers);

// Read a user by ID
router.get('/users', authenticateToken,userController.getUserById);

// Update a user
router.put('/users', authenticateToken ,userController.updateUser);

// Delete a user
router.delete('/users', authenticateToken ,userController.deleteUser);

// Login a user
router.post('/login', userController.login);

module.exports = router;
