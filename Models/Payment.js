const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  order_code: {
    type: String,
    undefined: true,
  },
  room_id: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Cancelled", "Paid"],
    required: true,
  },
  paymentDescription: {
    type: String,
    undefined: true,
  },
  paymentAmount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
