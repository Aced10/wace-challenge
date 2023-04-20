const mongoose = require("mongoose");
const { Schema } = mongoose;

const PaymentSourceSchema = new Schema({
  customerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  customerEmail: { type: String, required: true, unique: true },
  paymentSourceWomId: { type: Number, required: true },
  lastFour: { type: String },
  phoneNumber: { type: String },
  type: { type: String },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["AVAILABLE"],
      message: "Estado del metodo de pago!",
    },
    default: "AVAILABLE",
  },
});

module.exports = mongoose.model("payment.source", PaymentSourceSchema);
