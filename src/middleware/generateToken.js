const jwt = require("jsonwebtoken");

const tokenSign = (user) => {
  return jwt.sign({ ...user }, process.env.SECRET_JWT);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.SECRET_JWT);
  } catch (error) {
    return error;
  }
};

module.exports = {
  tokenSign,
  verifyToken,
};
