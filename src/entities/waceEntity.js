const axios = require("axios");

const CREATE_SOURCE_ROUTE = "payment_sources";
const CREATE_TRANSACTION_ROUTE = "transactions";
const GET_ACCEPTANCE_TOKEN_ROUTE = "merchants";
const PRIVATE_HEADERS = {
  headers: {
    Authorization: `Bearer ${process.env.WACE_PRIVATE_KEY}`,
    "Content-Type": "application/json",
  },
};
const createPaymentSource = async (sourceData) => {
  const body = mapSourceData(sourceData);
  try {
    const { status, data } = await axios.post(
      `${process.env.WACE_API}/${CREATE_SOURCE_ROUTE}`,
      body,
      PRIVATE_HEADERS
    );
    return { status, data: data?.data };
  } catch (error) {
    const { data, status } = error.response;
    return { data, status };
  }
};

const getAcceptanceToken = async () => {
  const response = await axios.get(
    `${process.env.WACE_API}/${GET_ACCEPTANCE_TOKEN_ROUTE}/${process.env.WACE_PUBLIC_KEY}`
  );
  return response?.data?.data?.presigned_acceptance;
};

const createTransaction = async (transactionData) => {
  const body = mapTransaction(transactionData);
  try {
    const { status, data } = await axios.post(
      `${process.env.WACE_API}/${CREATE_TRANSACTION_ROUTE}`,
      body,
      PRIVATE_HEADERS
    );
    return { status, data: data?.data };
  } catch (error) {
    const { data, status } = error.response;
    return { data, status };
  }
};

const mapSourceData = (sourceData) => {
  return {
    type: sourceData.type,
    token: sourceData.token,
    customer_email: sourceData.customerEmail,
    acceptance_token: sourceData.acceptanceToken,
  };
};
const mapTransaction = (transactionData) => {
  return {
    amount_in_cents: transactionData.amount,
    currency: transactionData.currency,
    customer_email: transactionData.customerEmail,
    payment_method: transactionData.paymentMethod,
    reference: transactionData.reference,
    payment_source_id: transactionData.paymentSourceWomId,
  };
};

module.exports = {
  createPaymentSource,
  getAcceptanceToken,
  createTransaction,
};
