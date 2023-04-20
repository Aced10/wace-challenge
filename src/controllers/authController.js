const { loginUser } = require("../entities/authEntity");

/**
 * @description Login user
 * @param {String} email to user
 * @param {String} password to user
 */
const login = async (req, res) => {
  const { email, password } = req.body;
  const { status, message, token, user } = await loginUser(email, password);
  res.status(status).json({ message, token, user });
};

module.exports = {
  login,
};
