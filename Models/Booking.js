const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingSchema = new Schema({
  User_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Room_id: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true,
  },
  Booking_date: {
    type: Date,
    default: Date.now,
  },
  Status: {
    type: String,
    enum: ["Pending", "Approved", "Canceled"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Booking", BookingSchema);
