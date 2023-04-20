const {
  findPaymentMethod,
  newPaymentSource,
  acceptanceTokenWace,
} = require("../entities/paymentsEntity");

const getPaymentMethodById = async (req, res) => {
  const { status, message, data } = await findPaymentMethod(req.params.id);
  res.status(status).json({ message, data });
};

const createPaymentMethod = async (req, res) => {
  const { status, message, data } = await newPaymentSource(req.body);
  res.status(status).json({ message, data });
};

const getAcceptanceToken = async (req, res) => {
  const { status, message, data } = await acceptanceTokenWace(req.body);
  res.status(status).json({ message, data });
};

module.exports = {
  getPaymentMethodById,
  createPaymentMethod,
  getAcceptanceToken,
};
