const express = require("express");
const FavoriteRouter = express.Router();
const FavoriteController = require("../Controllers/FavoriteController");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");

FavoriteRouter.get(
  "/",
  cors.cors,
  auth.verifyUser,
  FavoriteController.getFavorite
);
FavoriteRouter.post(
  "/create/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  FavoriteController.addFavorite
);
FavoriteRouter.delete(
  "/delete/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  FavoriteController.deleteFavorite
);

module.exports = FavoriteRouter;
