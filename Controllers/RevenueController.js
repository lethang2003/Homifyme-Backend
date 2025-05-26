const { payment } = require("paypal-rest-sdk");
const Payment = require("../Models/Payment");
const Room = require("../Models/Room");
const User = require("../Models/User");

//tổng doanh thu
exports.totalRevenue = async (req, res) => {
  try {
    const payments = await Payment.find({ paymentStatus: "Paid" });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting total revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//tất cả lịch sử thanh toán
exports.allPayments = async (req, res) => {
  try {
    const payments = await Payment.find();

    const responseData = [];
    for (let i = 0; i < payments.length; i++) {
      const room = await Room.findById(payments[i].room_id);
      const user = await User.findById(payments[i].user_id);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      responseData.push({
        ...payments[i]._doc,
        roomName: room.name,
        userName: user.username,
      });
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error getting all payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//lịch sử thanh toán theo user cho admin
exports.userPayments = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const payments = await Payment.find({ user_id: user._id });
    res.status(200).json(payments);
  } catch (error) {
    console.error("Error getting user payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//doanh thu hôm nay
exports.todayRevenue = async (req, res) => {
  try {
    const today = new Date(); //lấy ngày hiện tại
    const payments = await Payment.find({
      paymentDate: today,
      paymentStatus: "Paid",
    });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting today revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//doanh thu tháng này
exports.thisMonthRevenue = async (req, res) => {
  try {
    const today = new Date();
    const month = today.getMonth(); //lấy tháng hiện tại
    const year = today.getFullYear(); //lấy năm hiện tại
    const payments = await Payment.find({
      paymentDate: { $gte: new Date(year, month, 1) }, //lấy từ ngày 1 của tháng hiện tại
      paymentStatus: "Paid",
    });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting this month revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//doanh thu năm nay
exports.thisYearRevenue = async (req, res) => {
  try {
    const today = new Date();
    const year = today.getFullYear(); //lấy năm hiện tại
    const payments = await Payment.find({
      paymentDate: { $gte: new Date(year, 0, 1) }, //lấy từ ngày 1/1 của năm hiện tại
      paymentStatus: "Paid",
    });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting this year revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//chọn ngày trong tháng, năm và xem doanh thu
exports.dayRevenue = async (req, res) => {
  try {
    const day = req.body.day;
    const month = req.body.month;
    const year = req.body.year;
    const payments = await Payment.find({
      paymentDate: { $gte: new Date(year, month - 1, day) },
      paymentStatus: "Paid",
    });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting daily revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.monthRevenue = async (req, res) => {
  try {
    const year = req.body.year || new Date().getFullYear();
    const monthlyRevenue = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 1);

      const payments = await Payment.find({
        paymentDate: { $gte: startDate, $lt: endDate },
        paymentStatus: "Paid",
      });

      let total = 0;
      payments.forEach((payment) => {
        total += payment.paymentAmount;
      });

      monthlyRevenue.push({ month: month + 1, total });
    }

    res.status(200).json({ year, monthlyRevenue });
  } catch (error) {
    console.error("Error getting yearly revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//chọn năm và xem doanh thu
exports.yearRevenue = async (req, res) => {
  try {
    const year = req.body.year;
    const payments = await Payment.find({
      paymentDate: { $gte: year },
      paymentStatus: "Paid",
    });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting yearly revenue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//chọn phòng và xem doanh thu
exports.revenueByRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const payments = await Payment.find({ room_id: roomId });
    let total = 0;
    payments.forEach((payment) => {
      total += payment.paymentAmount;
    });
    res.status(200).json({ total: total });
  } catch (error) {
    console.error("Error getting revenue by room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//cá nhân user xem doanh thu
exports.revenueByUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const payments = await Payment.find({
      user_id: user._id,
      paymentStatus: "Paid",
    });

    let total = 0;
    const paymentDetails = [];

    for (let i = 0; i < payments.length; i++) {
      total += payments[i].paymentAmount;

      // Find the room associated with the payment
      const room = await Room.findById(payments[i].room_id);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Push the payment details along with the room name
      paymentDetails.push({
        _id: payments[i]._id,
        order_code: payments[i].order_code,
        paymentAmount: payments[i].paymentAmount,
        paymentStatus: payments[i].paymentStatus,
        paymentDescription: payments[i].paymentDescription,
        paymentDate: payments[i].paymentDate,
        roomName: room.name, // Include the room name
      });
    }

    // Return total revenue along with detailed payment information
    res.status(200).json({
      total: total,
      payments: paymentDetails,
    });
  } catch (error) {
    console.error("Error getting revenue by user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
