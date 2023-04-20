const mongoose = require("mongoose");
const { Schema } = mongoose;

const locationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
});

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    enum: {
      values: ["admin", "rider", "driver"],
      message: "Role no valido!",
    },
    default: "rider",
  },
  currentLocation: {
    type: locationSchema,
  },
});

module.exports = mongoose.model("user", UserSchema);
