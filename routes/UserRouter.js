const usercontroller = require("../Controllers/UserController");
const express = require("express");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const UserRouter = express.Router();

UserRouter.post("/signup", cors.corsWithOptions, usercontroller.signUp);
UserRouter.post("/login", cors.corsWithOptions, usercontroller.login);
UserRouter.get("/google/login", cors.cors, usercontroller.googleLogin);
UserRouter.get("/auth/callback", cors.cors, usercontroller.googleLoginCallback);
UserRouter.get("/logout", cors.cors, auth.verifyUser, usercontroller.logout);
UserRouter.put(
  "/change-password",
  cors.corsWithOptions,
  auth.verifyUser,
  usercontroller.changePassword
);
UserRouter.post(
  "/forgot-password",
  cors.corsWithOptions,
  usercontroller.forgotPassword
);
UserRouter.post(
  "/reset-password",
  cors.corsWithOptions,
  usercontroller.resetPassword
);
UserRouter.put(
  "/edit-profile",
  cors.corsWithOptions,
  auth.verifyUser,
  usercontroller.editProfile
);
UserRouter.get(
  "/profile",
  cors.cors,
  auth.verifyUser,
  usercontroller.getUserInfo
);
UserRouter.get("/all", cors.cors, usercontroller.getAllUsers);

UserRouter.get("/:id", cors.cors, usercontroller.getUserById);

UserRouter.put("/ban/:id", cors.cors, usercontroller.banUser);

UserRouter.get(
  "/getId/:username",
  cors.cors,

  usercontroller.getUserId
);
module.exports = UserRouter;
