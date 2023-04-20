const { findRide, newRide, endRide } = require("../entities/ridesEntity");

const getRideById = async (req, res) => {
  const { status, message, data } = await findRide(req.params.id);
  res.status(status).json({ message, data });
};

const createUserRide = async (req, res) => {
  const { status, message, data } = await newRide(req.params.userId, req.body);
  res.status(status).json({ message, data });
};

const finishRide = async (req, res) => {
  const { status, message, data } = await endRide(req.params.id, req.body);
  res.status(status).json({ message, data });
};

module.exports = {
  createUserRide,
  getRideById,
  finishRide,
};
