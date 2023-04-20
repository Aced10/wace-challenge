// Import the necessary modules
const paymentSourceModel = require("../models/payment.source");
const ridesModel = require("../models/ride");
const { addTransaction } = require("../entities/paymentsEntity");
const {
  calculateDistance,
  diffInMinutes,
  calculateRidePrice,
} = require("../helpers/rideCalculation");

const { newRide, findRide, endRide } = require("../entities/ridesEntity");

// Mock the required functions
jest.mock("../models/payment.source");
jest.mock("../models/ride");
jest.mock("../entities/paymentsEntity");
jest.mock("../helpers/rideCalculation");
jest.mock("../entities/paymentsEntity");

// Import the function to be tested

describe("Users entity", () => {
  describe("newRide", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should return an error when riderId is not provided", async () => {
      const rideData = { location: { latitude: 4.678, longitude: -74.056 } };
      const result = await newRide(null, rideData);
      expect(result).toEqual({
        status: 400,
        message: "El id del usuario y la ubicación de partida son requeridos!",
      });
    });

    test("should return an error when location is not provided", async () => {
      const result = await newRide("riderId", null);
      expect(result).toEqual({
        status: 400,
        message: "El id del usuario y la ubicación de partida son requeridos!",
      });
    });

    test("should return an error when payment source is not available", async () => {
      const rideData = { location: { latitude: 4.678, longitude: -74.056 } };
      const paymentSource = null;
      paymentSourceModel.findOne.mockResolvedValueOnce(paymentSource);
      const result = await newRide("riderId", rideData);
      expect(result).toEqual({
        status: 428,
        message: "Primero debes agregar un metodo de pago para el viaje!",
      });
    });

    test("should create a new ride successfully", async () => {
      const rideData = { location: { latitude: 4.678, longitude: -74.056 } };
      const paymentSource = { _id: "paymentSourceId" };
      const driver = { driverId: "driverId" };
      const ride = { _id: "rideId" };
      paymentSourceModel.findOne.mockResolvedValueOnce(paymentSource);
      ridesModel.create.mockResolvedValueOnce(ride);
      const nearestDriver = jest.fn().mockResolvedValueOnce(driver);
      const result = await newRide("riderId", rideData, nearestDriver);
      expect(result).toEqual({
        status: 200,
        message: "Viaje creado exitosamente!",
        data: ride,
      });
    });
  });

  describe("endRide", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("should return an error if rideId is missing", async () => {
      const result = await endRide(null, {
        location: { latitude: 123, longitude: 456 },
      });
      expect(result.status).toBe(400);
      expect(result.message).toBe("El viaje es requerido!");
    });

    test("should return an error if location is missing", async () => {
      const result = await endRide("ride123", null);
      expect(result.status).toBe(400);
      expect(result.message).toBe("El viaje es requerido!");
    });

    test("should return an error if an error occurs during the ride search", async () => {
      ridesModel.findById.mockImplementationOnce(() => {
        throw new Error("Some error occurred!");
      });

      const result = await endRide("ride123", {
        location: { latitude: 123, longitude: 456 },
      });

      expect(result.status).toBe(500);
      expect(result.message).toBe("Se presento un error al buscar el viaje!");
    });

    test("should return an error if the payment transaction fails", async () => {
      const ride = {
        _id: "ride123",
        startLocation: { latitude: 10, longitude: 20 },
        startTime: new Date(),
        baseFee: 5,
        pricePerKm: 2,
        pricePerMin: 1,
        paymentSourceId: "payment123",
      };
      ridesModel.findById.mockResolvedValueOnce(ride);

      addTransaction.mockResolvedValueOnce({
        status: 500,
        message: "Transaction failed!",
      });

      const result = await endRide("ride123", {
        location: { latitude: 30, longitude: 40 },
      });

      expect(addTransaction).toHaveBeenCalledWith({
        amount: expect.any(Number),
        currency: "COP",
        installments: 1,
        sourceId: "payment123",
      });
      expect(result.status).toBe(500);
      expect(result.message).toBe("Transaction failed!");
    });

    test("should end the ride successfully", async () => {
      const ride = {
        _id: "ride123",
        startLocation: { latitude: 10, longitude: 20 },
        startTime: new Date(),
        baseFee: 5,
        pricePerKm: 2,
        pricePerMin: 1,
        paymentSourceId: "payment123",
        save: jest.fn(),
      };
      ridesModel.findById.mockResolvedValueOnce(ride);

      addTransaction.mockResolvedValueOnce({
        status: 200,
        data: "transaction123",
      });

      const result = await endRide("ride123", {
        location: { latitude: 30, longitude: 40 },
      });

      expect(addTransaction).toHaveBeenCalledWith({
        amount: expect.any(Number),
        currency: "COP",
        installments: 1,
        sourceId: "payment123",
      });
      expect(ride.save).toHaveBeenCalled();
      expect(result.status).toBe(200);
      expect(result.message).toBe("A finalizado su viaje de manera exitosa!");
      expect(result.data).toBe("ride123");
    });
  });

  describe("findRide", () => {
    test("should return an error message when no rideId is provided", async () => {
      const expected = {
        status: 400,
        message: "El ID del viaje es requerido!",
      };
      const result = await findRide(undefined);
      expect(result).toEqual(expected);
    });

    test("should return an error message when an invalid rideId is provided", async () => {
      const expected = {
        status: 500,
        message: "Se presento un error al buscar el viaje!",
      };
      const result = await findRide("invalid_ride_id");
      expect(result).toEqual(expected);
    });

    test("should return a success message and the ride data when a valid rideId is provided", async () => {
      const ride = await ridesModel.create({
        riderId: "rider_1",
        driverId: "driver_1",
        paymentSourceId: "payment_source_1",
        startLocation: {
          latitude: 4.711,
          longitude: -74.0721,
        },
        startTime: new Date(),
        pricePerKm: 0.5,
        pricePerMin: 0.1,
        baseFee: 2,
      });

      const expected = {
        status: 200,
        message: "Se encontro el viaje de manera exitosa!",
        data: {
          _id: expect.any(String),
          riderId: "rider_1",
          driverId: "driver_1",
          paymentSourceId: "payment_source_1",
          startLocation: {
            latitude: 4.711,
            longitude: -74.0721,
          },
          startTime: expect.any(Date),
          pricePerKm: 0.5,
          pricePerMin: 0.1,
          baseFee: 2,
          status: "pending",
        },
      };
      const result = await findRide(ride._id);
      expect(result.status).toBe(expected.status);
      expect(result.message).toBe(expected.message);
      expect(result.data._id).toBeDefined();
      expect(result.data.riderId).toBe(expected.data.riderId);
      expect(result.data.driverId).toBe(expected.data.driverId);
      expect(result.data.paymentSourceId).toBe(expected.data.paymentSourceId);
      expect(result.data.startLocation.latitude).toBe(
        expected.data.startLocation.latitude
      );
      expect(result.data.startLocation.longitude).toBe(
        expected.data.startLocation.longitude
      );
      expect(result.data.startTime).toEqual(expected.data.startTime);
      expect(result.data.pricePerKm).toBe(expected.data.pricePerKm);
      expect(result.data.pricePerMin).toBe(expected.data.pricePerMin);
      expect(result.data.baseFee).toBe(expected.data.baseFee);
      expect(result.data.status).toBe(expected.data.status);
    });
  });
});
