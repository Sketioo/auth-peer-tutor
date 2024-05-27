const { User } = require('../models');
const bcrypt = require('bcryptjs');


exports.createUser = async (req, res) => {
  const { name, email, password, age, gender, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender,
      role
    });
    if (!user) {
      return res.status(400).json({
        message: 'Failed to create user',
        error_code: 400
      })
    }
    return res.status(201).json({
      message: 'User created successfully',
      data: user,
      error_code: 0
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error_code: 500
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: 'No users found',
        error_code: 404
      });
    }
    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: users,
      error_code: 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error_code: 404
      });
    }
    return res.status(200).json({
      message: 'User retrieved successfully',
      data: user,
      error_code: 0
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500
    });
  }
};

exports.updateUser = async (req, res) => {
  const { name, email, password, age, gender, role } = req.body;
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const hashedPassword = password ? await bcrypt.hash(password, 10) : user.password;
      await user.update({
        name,
        email,
        password: hashedPassword,
        age,
        gender,
        role
      });
      res.status(200).json({
        message: 'User updated successfully',
        data: user,
        error_code: 0
      });
    } else {
      res.status(404).json({
        message: 'User not found',
        error_code: 404
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(204).json({
        message: 'User deleted successfully',
        error_code: 0
      });
    } else {
      res.status(404).json({
        message: 'User not found',
        error_code: 404
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500
    });
  }
};
