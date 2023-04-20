// Models
const paymentSourceModel = require("../models/payment.source");
const usersModel = require("../models/user");
const ridesModel = require("../models/ride");

const { addTransaction } = require("../entities/paymentsEntity");

// Const
const {
  BASE_FEE,
  PRICE_PER_KM,
  PRICE_PER_MIN,
  // Coordenadas dentro de Bogota 😂
  MIN_LAT,
  MAX_LAT,
  MIN_LON,
  MAX_LON,
} = require("../helpers/rideConstans");

const {
  DEFAULT_INSTALLMENTS,
  DEFAULT_CURRENCY,
} = require("../helpers/paymentConstans");

// Utils
const {
  calculateDistance,
  diffInMinutes,
  calculateRidePrice,
} = require("../helpers/rideCalculation");
const { randomNumber } = require("../helpers/utils");

const newRide = async (riderId, rideData) => {
  let { location } = rideData;

  // Only for this case asign rider location
  if (!location) location = await getRiderLocation(riderId);

  if (!riderId || !location)
    return {
      status: 400,
      message: "El id del usuario y la ubicación de partida son requeridos!",
    };
  try {
    const paymentSource = await paymentSourceModel.findOne({
      customerId: riderId,
      status: "AVAILABLE",
    });
    if (!paymentSource)
      return {
        status: 428,
        message: "Primero debes agregar un metodo de pago para el viaje!",
      };
    const { driverId } = await nearestDriver(location);
    const newRide = await ridesModel.create({
      riderId,
      driverId,
      paymentSourceId: paymentSource._id,
      startLocation: location,
      startTime: new Date(),
      pricePerKm: PRICE_PER_KM,
      pricePerMin: PRICE_PER_MIN,
      baseFee: BASE_FEE,
    });
    return {
      status: 200,
      message: "Viaje creado exitosamente!",
      data: newRide,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al crear el viaje!",
      data: error,
    };
  }
};

const findRide = async (rideId) => {
  if (!userId) return { status: 400, message: "El ID del viaje es requerido!" };
  try {
    const ride = await ridesModel.findById(rideId);
    return {
      status: 200,
      message: "Se encontro el viaje de manera exitosa!",
      data: ride,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error al buscar el viaje!",
      data: error,
    };
  }
};

const endRide = async (rideId, location) => {
  // Condition to simulate final location, only dev
  if (!location) location = generateEndLocation();
  if (!rideId || !location)
    return { status: 400, message: "El viaje es requerido!" };
  try {
    const endLocation = location;
    const ride = await ridesModel.findById(rideId);
    const totalDistanceKm = calculateDistance(
      ride.startLocation.latitude,
      ride.startLocation.longitude,
      endLocation.location.latitude,
      endLocation.location.longitude
    );
    const endTime = new Date();
    const totalTimeMin = diffInMinutes(endTime, ride.startTime);
    //baseFee, distance, pricePerKm, time, pricePerMin
    const price = calculateRidePrice({
      baseFee: ride.baseFee,
      pricePerKm: ride.pricePerKm,
      pricePerMin: ride.pricePerMin,
      distance: totalDistanceKm,
      time: totalTimeMin,
    });
    const { status, message, data } = await addTransaction({
      amount: price * 100,
      currency: DEFAULT_CURRENCY,
      installments: DEFAULT_INSTALLMENTS,
      sourceId: ride.paymentSourceId,
    });
    console.log();
    if (status !== 200) return { status, message, data };
    ride.endLocation = endLocation.location;
    ride.endTime = endTime;
    ride.transactionId = data;
    ride.totalDistanceKm = totalDistanceKm;
    ride.totalTimeMin = totalTimeMin;
    ride.price = price;
    ride.status = "completed";
    ride.save();
    return {
      status: 200,
      message: "A finalizado su viaje de manera exitosa!",
      data: ride._id,
    };
  } catch (error) {
    return {
      status: 500,
      message: "Se presento un error durante la finalización del viaje!",
      data: error,
    };
  }
};

const nearestDriver = async (startLocation) => {
  const availablesDrivers = await usersModel.find(
    { role: "driver" },
    { currentLocation: 1 }
  );
  const driversDistances = calculateDriversDistance(
    availablesDrivers,
    startLocation
  );
  return driversDistances.sort(
    (driverA, driverB) => driverA.distance - driverB.distance
  )[0];
};

const calculateDriversDistance = (availablesDrivers, startLocation) => {
  return availablesDrivers.map((driver) => {
    return {
      driverId: driver._id,
      distance: calculateDistance(
        startLocation.latitude,
        startLocation.longitude,
        driver.currentLocation?.latitude,
        driver.currentLocation?.longitude
      ),
    };
  });
};

const generateEndLocation = () => {
  const latitude = randomNumber(MIN_LAT, MAX_LAT, 6);
  const longitude = randomNumber(MIN_LON, MAX_LON, 6);
  return { location: { latitude, longitude } };
};

const getRiderLocation = async (riderId) => {
  const { currentLocation } = await usersModel.findById(riderId);
  return currentLocation;
};

module.exports = {
  findRide,
  newRide,
  endRide,
};
