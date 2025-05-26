const express = require("express");
const router = express.Router();
const PaymentController = require("../Controllers/PaymentController");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");
const { verify } = require("crypto");

router.post(
  "/create/:roomId",
  cors.corsWithOptions, auth.verifyUser, auth.verifyAdmin,
  PaymentController.createPaymentV2
);
router.post("/check/:orderCode", cors.cors, PaymentController.checkPayment);

module.exports = router;
