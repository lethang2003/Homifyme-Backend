const express = require("express");
const LandlordRouter = express.Router();
const LandlordController = require("../Controllers/LandlordController");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");

LandlordRouter.get("/", cors.cors, LandlordController.allLandlord);
LandlordRouter.get("/:id", cors.cors, LandlordController.getLandlord);
LandlordRouter.post(
  "/",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  LandlordController.createLandlord
);
LandlordRouter.put(
  "/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  LandlordController.updateLandlord
);
LandlordRouter.delete(
  "/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  LandlordController.deleteLandlord
);

module.exports = LandlordRouter;
