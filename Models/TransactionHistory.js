const mongoose = require("mongoose");
const Booking = require("./Booking");
const Schema = mongoose.Schema;

const TransactionHistorySchema = new Schema({
  Booking_id: {
    type: Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  Admin_id: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  Payment_date: {
    type: Date,
    default: Date.now,
  },
  Transaction_status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("TransactionHistory", TransactionHistorySchema);
