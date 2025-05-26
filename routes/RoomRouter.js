const express = require("express");
const RoomRouter = express.Router();
const RoomController = require("../Controllers/RoomController");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");

RoomRouter.get("/sort-all", cors.cors, RoomController.sortAll);

RoomRouter.get("/all", cors.cors, RoomController.getAllRooms);
RoomRouter.get("/available", cors.cors, RoomController.getAvailableRooms);

// Routes/RoomRouter.js

RoomRouter.get(
  "/find-rooms-by-landlord/:id",
  cors.cors,
  RoomController.getRoomsByLandlord
);

RoomRouter.get("/:roomId", cors.cors, RoomController.getRoom);

RoomRouter.post(
  "/create",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RoomController.createRoom
);
RoomRouter.put(
  "/update/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RoomController.updateRoom
);
RoomRouter.put(
  "/update-quantity/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RoomController.updateQuantity
);
RoomRouter.patch(
  "/status/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RoomController.setStatus
);

RoomRouter.delete(
  "/delete/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RoomController.deleteRoom
);

module.exports = RoomRouter;
