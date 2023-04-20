const { tokenSign } = require("../middleware/generateToken");
const { compare } = require("../helpers/handleBcrypt");
const userModel = require("../models/user");

/**
 * @description Create new user
 * @param {String} email to user
 * @param {String} password to user
 */
const loginUser = async (email, password) => {
  try {
    const user = await userModel
      .findOne({ email }, { password: 1, role: 1, name: 1, email: 1 });
    if (!user) {
      return { status: 404, message: "User not found!" };
    }
    const checkPassword = await compare(password, user.password);
    if (!checkPassword) {
      return { status: 403, message: "Password and user don't match!" };
    }
    const token = await tokenSign(user);
    return { status: 200, message: "Login success!", user, token };
  } catch (error) {
    return { status: 500, message: ""+error };
  }
};

module.exports = {
  loginUser,
};
