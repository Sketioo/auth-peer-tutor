const models = require('../models');
const bcrypt = require('bcryptjs');

const {
  generateAccessToken,
  getUserId,
} = require('../helpers/utility')


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, role } = req.body;
    const checkUser = await models.User.findOne({
      where: {
        email
      }
    })

    if (checkUser) {
      return res.status(400).json({
        message: 'User already exists',
        error_code: 400
      })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const lowerCaseGender = gender.toLowerCase();
    const user = await models.User.create({
      name,
      email,
      password: hashedPassword,
      age,
      gender: lowerCaseGender,
      role
    });

    const { passsword, ...userNoPassword } = user.dataValues;

    if (!user) {
      return res.status(400).json({
        message: 'Failed to create user',
        error_code: 400
      })
    }
    return res.status(201).json({
      message: 'User created successfully',
      data: userNoPassword,
      error_code: 0
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error_code: 500
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await models.User.findOne({ where: { email } });
    if (user) {
      const { password, ...customUser } = user.dataValues;
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (validPassword) {
        const token = generateAccessToken(user);
        return res.status(200).json({
          message: 'Login success',
          data: {
            customUser,
            token
          },
          error_code: 0
        })
      } else {
        return res.status(401).json({
          message: 'Invalid credentials',
          error_code: 401
        })
      }
    } else {
      return res.status(404).json({
        message: 'User not found',
        error_code: 404
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500
    })
  }
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await models.User.findAll();
    if (!users || users.length === 0) {
      return res.status(404).json({
        message: 'No users found',
        error_code: 404
      });
    }

    const customizedUsers = users.map((user) => {
      const {
        password,
        ...customizedUser
      } = user.dataValues;
      return customizedUser;
    });
    return res.status(200).json({
      message: 'Users retrieved successfully',
      data: customizedUsers,
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
    const userId = getUserId(req);
    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error_code: 404
      });
    }

    const { password, ...userNoPassword } = user.dataValues;

    return res.status(200).json({
      message: 'User retrieved successfully',
      data: userNoPassword,
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
    const userId = getUserId(req);
    const user = await models.User.findByPk(userId);
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

      return res.status(200).json({
        message: 'User updated successfully',
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
    const userId = getUserId(req)
    const user = await models.User.destroy({
      where: {
        id: userId
      }
    })

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error_code: 404
      })
    }

    return res.status(200).json({
      message: 'User deleted successfully',
      error_code: 0
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
      error_code: 500
    });
  }
};


