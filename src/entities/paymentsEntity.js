const uuid = require("uuid");

// Models
const paymentSourceModel = require("../models/payment.source");
const transactionModel = require("../models/transaction");

// Wace Integration function
const {
  createPaymentSource,
  getAcceptanceToken,
  createTransaction,
} = require("./waceEntity");

const newPaymentSource = async (sourceData) => {
  const { customerId, customerEmail, acceptanceToken, type, token } =
    sourceData;
  if (!customerId || !customerEmail || !acceptanceToken || !type || !token)
    return {
      status: 400,
      message: "Todos los campos del metodo de pago son requeridos",
    };
  const { data, status } = await createPaymentSource({
    type,
    token,
    customerEmail,
    acceptanceToken,
  });
  if (status !== 201) return { status, data };
  try {
    const newPaymentSource = await paymentSourceModel.create({
      customerId,
      type,
      token,
      customerEmail,
      paymentSourceWomId: data?.id,
      status: data?.status,
      lastFour: data?.public_data?.last_four,
      phoneNumber: data?.public_data?.phone_number,
    });
    return {
      status: 200,
      message: "Metodo de pago creado exitosamente!",
      data: newPaymentSource,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al crear el metodo de pago!",
      data: error,
    };
  }
};

const findPaymentMethod = async (paymentSourceId) => {
  if (!paymentSourceId)
    return { status: 400, message: "El ID del metodo de pago es requerido!" };
  try {
    const paymentSource = await paymentSourceModel.findById(paymentSourceId);
    if (!paymentSource)
      return { status: 404, message: "No se encontro el metodo de pago." };
    return {
      status: 200,
      message: "Se encontro el metodo de pago de manera exitosa!",
      data: paymentSource,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al buscar el metodo de pago!",
      data: error,
    };
  }
};

const acceptanceTokenWace = async () => {
  try {
    const acceptanceToken = await getAcceptanceToken();
    return {
      status: 200,
      message: "Se obtuvo el token de aceptaciòn de manera exitosa!",
      data: acceptanceToken,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Ocurrio un error en la solicitud del token de aceptaciòn!",
      data: error,
    };
  }
};

const addTransaction = async (transactionData) => {
  const { sourceId, amount, currency, installments } = transactionData;
  if (!sourceId || !amount || !currency)
    return {
      status: 400,
      message:
        "Los campos metodo de pago, valor y moneda son requeridos para crear la transacción",
    };
  try {
    const paymentSource = await paymentSourceModel.findById(sourceId);
    if (!paymentSource)
      return { status: 404, message: "No se encontro el metodo de pago." };
    const { data, status } = await createTransaction({
      customerEmail: transactionData.customerEmail,
      paymentSourceWomId: transactionData.paymentSourceWomId,
      amount,
      currency,
      paymentMethod: { installments: installments ?? 1 },
      reference: uuid.v4(),
    });
    if (status !== 201) return { status, data };
    const newTransaction = await transactionModel.create({
      paymentSourceId: sourceId,
      amount,
      currency,
      reference: data.reference,
      createAt: new Date(),
    });
    return {
      status: 200,
      message: "Se creo la transaccion de manera exitosa!",
      data: newTransaction._id,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Ocurrio un error durante la creacion de la transacciòn!",
      data: error,
    };
  }
};

module.exports = {
  findPaymentMethod,
  newPaymentSource,
  acceptanceTokenWace,
  addTransaction,
};
