const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new Schema(
  {
    googleId: {
      type: String,
      default: undefined,
    },
    username: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    dayOfBirth: {
      type: Date,
      default: undefined,
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    admin: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      default: undefined,
    },
    resetPasswordOTP: {
      type: String,
      default: undefined,
    },
    resetPasswordExpires: {
      type: Date,
      default: undefined,
    },
    banned: {
      type: Boolean,
      default: false,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  
);

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
