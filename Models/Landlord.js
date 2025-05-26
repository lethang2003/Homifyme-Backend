const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const landlordSchema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dayOfBirth: {
      type: Date,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: undefined,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
 
);

// Check if the model already exists before defining it
module.exports =
  mongoose.models.Landlord || mongoose.model("Landlord", landlordSchema);
