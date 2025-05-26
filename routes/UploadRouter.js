const express = require("express");
const bodyParser = require("body-parser");
const auth = require("../loaders/authenticate");
const uploadController = require("../Controllers/UploadController");
const uploadRouter = express.Router();
const cors = require("../loaders/cors");

uploadRouter.use(bodyParser.json());

//Avatar for user
uploadRouter.post(
  "/upload-avatar-user",
  cors.corsWithOptions,
  auth.verifyUser,
  uploadController.uploadAvatarUser
);
//Edit user Avatar
uploadRouter.put(
  "/edit-avatar-user",
  cors.corsWithOptions,
  auth.verifyUser,
  uploadController.editAvatarUser
);

//Avatar for landlord
uploadRouter.post(
  "/upload-avatar-landlord/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  uploadController.uploadAvatarLandlord
);
//Edit landlord Avatar
uploadRouter.put(
  "/edit-avatar-landlord/:id",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  uploadController.editAvatarLandlord
);

//Room image
uploadRouter.post(
  "/upload-room-image/:roomId",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  uploadController.uploadRoomImage
);

//Set main room image
uploadRouter.put(
  "/set-main/:roomId/:imageId",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  uploadController.setMainImage
);

//Set default room image
uploadRouter.put(
  "/set-default/:roomId/:imageId",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  uploadController.setDefaultImage
);

//delete room image
uploadRouter.delete(
  "/delete-room-image/:roomId/:imageId",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  uploadController.deleteRoomImage
);

module.exports = uploadRouter;
