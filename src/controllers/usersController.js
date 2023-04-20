const {
  newUser,
  allUsers,
  userById,
  modifyUser,
  deleteOneUser,
} = require("../entities/usersEntity");

const createUser = async (req, res) => {
  const { status, message, data } = await newUser(req.body);
  res.status(status).json({ message, data });
};

const getUsers = async (req, res) => {
  const { status, message, data } = await allUsers(req.query);
  res.status(status).json({ message, data });
};

const getUserById = async (req, res) => {
  const { status, message, data } = await userById(req.params.id);
  res.status(status).json({ message, data });
};

const updateUser = async (req, res) => {
  const { status, message, data } = await modifyUser(req.params.id, req.body);
  res.status(status).json({ message, data });
};

const deleteUser = async (req, res) => {
  const response = await deleteOneUser(req.params.id);
  res.status(response.status).json(response);
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
