const config = require("../Configuration/config");
const mongoose = require("mongoose");
const User = require("../Models/User");
const { EventEmitterAsyncResource } = require("nodemailer/lib/xoauth2");

const url = config.database;
const connect = mongoose.connect(url);
connect.then(
  async (db) => {
    const user = await User.find({ admin: true });
    if (user.length === 0) {
      User.register(
        new User({
          username: "admin",
          fullname: "Admin",
          email: "admin@gmail.com",
          admin: true,
        }),
        "admin123",
        (err, user) => {
          if (err) {
            console.log("Error registering admin user:", err);
          } else {
            console.log("Admin user registered successfully");
          }
        }
      );
    }
    console.log("Connected correctly to server");
  },
  (err) => {
    console.log(err);
  }
);
