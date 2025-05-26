const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    default: false,
  },
  main: {
    type: Boolean,
    default: false,
  },
});

const CommentSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  content: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const AddressSchema = new Schema({
  detail: {
    type: String,
  },
  ward: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    default: "Cần Thơ",
  },
});

const RoomSchema = new Schema({
  landlord_id: {
    type: Schema.Types.ObjectId,
    ref: "Landlord",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  room_type: {
    type: String,
    enum: ["Single", "Double", "Shared"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  total_rating: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },
  room_quantity: {
    type: Number,
    required: true,
  },
  address: [AddressSchema],
  images: [ImageSchema],
  comments: [CommentSchema],
});

module.exports = mongoose.model("Room", RoomSchema);
