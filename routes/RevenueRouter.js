const express = require("express");
const router = express.Router();
const RevenueController = require("../Controllers/RevenueController");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");
//tất cả lịch sử thanh toán
router.get(
  "/all",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.allPayments
);
//doanh thu theo user cho admin
router.get(
  "/user/:userId",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.userPayments
);
//doanh thu hôm nay
router.get(
  "/today",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.todayRevenue
);
//doanh thu tháng này
router.get(
  "/thismonth",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.thisMonthRevenue
);
//doanh thu năm nay
router.get(
  "/thisyear",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.thisYearRevenue
);
//nhập ngày, tháng, năm để xem doanh thu
router.get(
  "/day",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.dayRevenue
);
//nhập tháng và năm để xem doanh thu
router.get(
  "/month",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.monthRevenue
);
//nhập năm để xem doanh thu
router.get(
  "/year",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.yearRevenue
);
//tổng doanh thu
router.get(
  "/total",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.totalRevenue
);
//doanh thu theo phòng
router.get(
  "/room/:roomId",
  cors.corsWithOptions,
  auth.verifyUser,
  auth.verifyAdmin,
  RevenueController.revenueByRoom
);
//cá nhân user xem doanh thu
router.get(
  "/user",
  cors.corsWithOptions,
  auth.verifyUser,
  RevenueController.revenueByUser
);
module.exports = router;
