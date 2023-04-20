const uuid = require("uuid");
const paymentSourceModel = require("../models/payment.source");
const transactionModel = require("../models/transaction");
const {
  createPaymentSource,
  createTransaction,
} = require("../entities/waceEntity");

const {
  newPaymentSource,
  findPaymentMethod,
  acceptanceTokenWace,
  addTransaction,
} = require("../entities/paymentsEntity");

jest.mock("../models/payment.source");
jest.mock("../models/transaction");
jest.mock("../entities/waceEntity");

describe("Payments", () => {
  describe("newPaymentSource", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test("should return an error if createPaymentSource response 400", async () => {
      const sourceData = {
        customerId: uuid.v4(),
        customerEmail: "test@example.com",
        acceptanceToken: "test_token",
        type: "credit_card",
        token: "test_token",
      };
      const expectedResponse = {
        status: 400,
        data: {},
      };
      createPaymentSource.mockResolvedValue({ status: 400, data: {} });

      const result = await newPaymentSource(sourceData);

      expect(result).toEqual(expectedResponse);
      expect(createPaymentSource).toHaveBeenCalledWith({
        type: sourceData.type,
        token: sourceData.token,
        customerEmail: sourceData.customerEmail,
        acceptanceToken: sourceData.acceptanceToken,
      });
    });

    test("should return 200 and the new payment source when creation succeeds", async () => {
      const sourceData = {
        customerId: "123",
        customerEmail: "test@example.com",
        acceptanceToken: "12345",
        type: "card",
        token: "token",
      };
      const paymentSource = {
        customerId: sourceData.customerId,
        type: sourceData.type,
        token: sourceData.token,
        customerEmail: sourceData.customerEmail,
        paymentSourceWomId: "1",
        status: "active",
        lastFour: "1234",
        phoneNumber: "555-5555",
      };
      paymentSourceModel.create.mockResolvedValue(paymentSource);
      const expected = {
        status: 200,
        message: "Metodo de pago creado exitosamente!",
        data: paymentSource,
      };
      const result = await newPaymentSource(sourceData);
      expect(result).toEqual(expected);
    });
  });

  describe("findPaymentMethod", () => {
    test("should find a payment source successfully", async () => {
      const mockPaymentSource = {
        customerId: "123",
        type: "card",
        token: "tok_123abc",
        customerEmail: "johndoe@example.com",
        paymentSourceWomId: "src_abc123",
        status: "AVAILABLE",
        lastFour: "1234",
        phoneNumber: "+57 30000000000",
      };
      const mockPaymentSourceId = "abc123";
      const paymentSourceModelFindByIdSpy = jest
        .spyOn(paymentSourceModel, "findById")
        .mockResolvedValue(mockPaymentSource);

      const result = await findPaymentMethod(mockPaymentSourceId);

      expect(paymentSourceModelFindByIdSpy).toHaveBeenCalledWith(
        mockPaymentSourceId
      );
      expect(result.status).toBe(200);
      expect(result.message).toBe(
        "Se encontro el metodo de pago de manera exitosa!"
      );
      expect(result.data).toEqual(mockPaymentSource);

      paymentSourceModelFindByIdSpy.mockRestore();
    });

    test("should return an error if payment source not found", async () => {
      const mockPaymentSourceId = "abc1234";
      const paymentSourceModelFindByIdSpy = jest
        .spyOn(paymentSourceModel, "findById")
        .mockResolvedValue(null);

      const result = await findPaymentMethod(mockPaymentSourceId);

      expect(paymentSourceModelFindByIdSpy).toHaveBeenCalledWith(
        mockPaymentSourceId
      );
      expect(result.status).toBe(404);
      expect(result.message).toBe("No se encontro el metodo de pago.");
      expect(result.data).toBeUndefined();

      paymentSourceModelFindByIdSpy.mockRestore();
    });

    test("should handle errors thrown by paymentSourceModel.findById", async () => {
      const mockPaymentSourceId = "abc123";
      const mockError = new Error("Test error");
      const paymentSourceModelFindByIdSpy = jest
        .spyOn(paymentSourceModel, "findById")
        .mockRejectedValue(mockError);

      const result = await findPaymentMethod(mockPaymentSourceId);

      expect(paymentSourceModelFindByIdSpy).toHaveBeenCalledWith(
        mockPaymentSourceId
      );
      expect(result.status).toBe(500);
      expect(result.message).toBe(
        "Se presento un error al buscar el metodo de pago!"
      );
      expect(result.data).toEqual(mockError);

      paymentSourceModelFindByIdSpy.mockRestore();
    });

    test("should handle missing payment source ID", async () => {
      const result = await findPaymentMethod();

      expect(result.status).toBe(400);
      expect(result.message).toBe("El ID del metodo de pago es requerido!");
      expect(result.data).toBeUndefined();
    });
  });

  describe("acceptanceTokenWace", () => {
    test("should return an object with status 200 and a token", async () => {
      const result = await acceptanceTokenWace();
      expect(result.status).toBe(200);
    });
  });

  describe("addTransaction", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test("should create a new transaction and return its ID when given valid data", async () => {
      const sourceId = "some-source-id";
      const amount = 1000;
      const currency = "COP";
      const installments = 3;
      const paymentSource = {
        _id: sourceId,
        type: "credit_card",
        token: "some-card-token",
        customerEmail: "test@example.com",
        paymentSourceWomId: "some-wom-id",
        status: "AVAILABLE",
        lastFour: "1234",
        phoneNumber: "32324000000",
      };
      paymentSourceModel.findById.mockResolvedValue(paymentSource);
      const transactionReference = "some-transaction-reference";
      const createdTransaction = {
        _id: "some-transaction-id",
        paymentSourceId: sourceId,
        amount,
        currency,
        reference: transactionReference,
        createAt: new Date(),
      };
      createTransaction.mockResolvedValue({
        data: {
          reference: transactionReference,
        },
        status: 201,
      });
      transactionModel.create.mockResolvedValue(createdTransaction);

      const result = await addTransaction({
        sourceId,
        amount,
        currency,
        installments,
      });

      expect(paymentSourceModel.findById).toHaveBeenCalledTimes(1);
      expect(paymentSourceModel.findById).toHaveBeenCalledWith(sourceId);
      expect(createTransaction).toHaveBeenCalledTimes(1);
      expect(createTransaction).toHaveBeenCalledWith({
        paymentSourceWomId: paymentSource.paymentSourceWomId,
        customerEmail: paymentSource.customerEmail,
        amount,
        currency,
        paymentMethod: { installments },
        reference: expect.any(String),
      });

      expect(transactionModel.create).toHaveBeenCalledTimes(1);
      expect(transactionModel.create).toHaveBeenCalledWith(createdTransaction);
      expect(result).toEqual({
        status: 200,
        message: "Se creo la transaccion de manera exitosa!",
        data: createdTransaction._id,
      });
    });

    test("should return a 400 error when missing required data", async () => {
      const result = await addTransaction({});
      expect(result).toEqual({
        status: 400,
        message:
          "Los campos metodo de pago, valor y moneda son requeridos para crear la transacción",
      });
    });

    test("should return a 404 error when the payment source is not found", async () => {
      paymentSourceModel.findById.mockResolvedValue(null);
      const result = await addTransaction({
        sourceId: "non-existent-source-id",
        amount: 1000,
        currency: "COP",
      });
      expect(result).toEqual({
        status: 404,
        message: "No se encontro el metodo de pago.",
      });
    });

    test("should return an error when the transaction creation fails", async () => {
      paymentSourceModel.findById.mockResolvedValue({});
      createTransaction.mockResolvedValue({ status: 500, data: {} });
      const { status } = await addTransaction({
        sourceId: "some-source-id",
        amount: 1000,
        currency: "COP",
      });
      expect(status).toEqual(500);
    });
  });
});
