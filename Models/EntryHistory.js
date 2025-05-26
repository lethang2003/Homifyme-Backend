const e = require("express");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EntryHistorySchema = new Schema({
  entry_date: {
    type: Date,
    default: Date.now,
  },
  entry_type: {
    type: String,
    enum: ["Created", "Updated"],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  admin_id: {
    type: Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
});

module.exports = mongoose.models.EntryHistory || mongoose.model("EntryHistory", EntryHistorySchema);
