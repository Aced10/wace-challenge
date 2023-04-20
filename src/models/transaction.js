const mongoose = require("mongoose");
const { Schema } = mongoose;

const TransactionSchema = new Schema({
  paymentSourceId: {
    type: Schema.Types.ObjectId,
    ref: "payment.sources",
    required: true,
  },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  reference: { type: String, required: true },
  createAt: { type: Date, required: true },
});

module.exports = mongoose.model("transaction", TransactionSchema);
