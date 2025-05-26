const User = require("../Models/User");
const authenticate = require("../loaders/authenticate");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bodyParser = require("body-parser");

exports.getUserById = (req, res) => {
  const userId = req.params.id; // Lấy ID từ URL
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Người dùng không tồn tại" });
      }
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

//Get all users
exports.getAllUsers = (req, res) => {
  try {
    User.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(users);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
//Sign up
exports.signUp = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    User.register(
      new User({
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
      }),
      req.body.password,
      (err, user) => {
        if (err) {
          return res.status(500).json({ message: err });
        } else {
          if (req.body) {
            user.fullname = req.body.fullname;
            user.email = req.body.email;
            user.dayOfBirth = req.body.dayOfBirth;
            user.phone = req.body.phone;
            user.address = req.body.address;
            user.gender = req.body.gender;
            user.admin = req.body.admin;
          }
          user
            .save()
            .then(() => {
              passport.authenticate("local")(req, res, () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({
                  success: true,
                  status: "Registration Successful!",
                });
              });
            })
            .catch((err) => {
              return res.status(500).json({ message: err });
            });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

//Login in website
exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    } else if (user.banned) {
      res.statusCode = 403;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: "You are banned!" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      var token = authenticate.getToken({ _id: req.user._id });
      res.status(200).end(token);
    });
  })(req, res, next);
};

//Login with Google account
exports.googleLogin = (req, res) => {
  passport.authenticate(
    "google",
    { scope: ["profile", "email"] },
    (req, res) => {
      if (req.user) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json({ mess: "Login success!" });
      } else if (req.user.banned) {
        res.statusCode = 403;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "You are banned!" });
      } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "Login failed!" });
      }
    }
  )(req, res);
};

exports.googleLoginCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }
    var token = authenticate.getToken({
      _id: user._id,
      email: user.email,
    });
    res.cookie("Token", token, { maxAge: 7200000, path: "/" }); // dùng cookie để lưu token
    res.status(200).end(token);
  })(req, res, next);
};

//Logout
exports.logout = (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("session-id");
    res.json({ message: "Logout successfully" });
  } else {
    res.json({ message: "You are not logged in" });
  }
};

//Change password
exports.changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    user.changePassword(oldPassword, newPassword, (err) => {
      if (err) {
        res.status(500).json({ message: err });
      } else {
        user.save();
        res.status(200).json({ message: "Password changed successfully!" });
      }
    });
  } else {
    res.status(500).json({ message: "User not found!" });
  }
};

//Forgot password
exports.forgotPassword = (req, res) => {
  if (req.body.email === "") {
    res.status(400).send("email required");
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      res.status(403).send("email not Exist!");
    } else {
      const otp = crypto.randomBytes(3).toString("hex");
      user.resetPasswordOTP = otp;
      user.resetPasswordExpires = Date.now() + 600000; //10 minutes

      user.save().then(() => {
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "datnptce171966@fpt.edu.vn",
            pass: "txkt gohh zzth xdon",
          },
        });

        let mailOptions = {
          to: user.email,
          from: "mailcuadatnguyen@gmail.com",
          subject: "OTP for reset password",
          html: `
          <p>Dear User,</p>

          <p>You are receiving this message because a password reset was requested for your account.</p>

          <p>Please use the following <strong style="font-size: 1em;">OTP</strong> to reset your password:</p>

          <strong style="font-size: 1.5em;">${otp}</strong>

          <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>

          <p>Thank you,</p>

          <p>Best Book</p>
`,
        };

        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          } else {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json({
              success: true,
              status: "OTP sent to email!",
            });
          }
        });
      });
    }
  });
};

//Reset password
exports.resetPassword = (req, res) => {
  User.findOne({
    resetPasswordOTP: req.body.otp,
    resetPasswordExpires: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        res.status(403).send("OTP invalid or has expired!");
      } else {
        user.setPassword(req.body.newPassword, (err) => {
          if (err) {
            return res.status(500).json({ message: err });
          }
          user.resetPasswordOTP = undefined;
          user.resetPasswordExpires = undefined;
          user.save();
          res.status(200).json({ message: "Password reset successfully" });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
};

//Edit profile
exports.editProfile = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        if (req.body) {
          user.fullname = req.body.fullname;
          user.dayOfBirth = req.body.dayOfBirth;
          user.phone = req.body.phone;
          user.address = req.body.address;
        }
        user
          .save()
          .then((user) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user);
          })
          .catch((err) => {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          });
      } else {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: "User not found!" });
      }
    })
    .catch((err) => {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.json({ err: err });
    });
};

//Get user info
exports.getUserInfo = (req, res) => {
  User.findById(req.user._id).then((user) => {
    res.body = user;
    console.log(user);
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json(user);
  });
};

exports.banUser = async (req, res) => {
  const userId = req.params.id; // Get user ID from URL

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Toggle the banned status
    user.banned = !user.banned; // Đảo ngược trạng thái banned

    await user.save();
    res.status(200).json({
      message: user.banned
        ? "User has been banned successfully."
        : "User has been restored successfully.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request: " + error.message });
  }
};

exports.getUserId = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username }).select("_id");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request: " + error.message });
  }
};
