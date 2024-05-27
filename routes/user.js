const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create a user
router.post('/users', userController.createUser);

// Read all users
router.get('/users', userController.getAllUsers);

// Read a user by ID
router.get('/users/:id', userController.getUserById);

// Update a user
router.put('/users/:id', userController.updateUser);

// Delete a user
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
