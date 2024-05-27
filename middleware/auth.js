const {
  verifyAccessToken
} = require('../helpers/utility')

exports.authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error_code: 401,
      message: "Kredential tidak sah!",
    });
  }

  const result = await verifyAccessToken(token);

  if (!result.success) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Kredential tidak sah!",
        error_code: 401,
      });
  }

  req.data = result.token;
  next();
};