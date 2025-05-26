const Payment = require("../Models/Payment");
const Room = require("../Models/Room");
const User = require("../Models/User");
const config = require("../Configuration/config");
const payOS = require("../Configuration/payos");
const EntryHistory = require("../Models/EntryHistory");

exports.createPaymentV2 = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const userId = req.body.userId;
    const paymentAmount = req.body.paymentAmount;
    console.log("userId", userId);
    console.log("paymentAmount", paymentAmount);
    console.log("roomId", roomId);

    if (!userId || !paymentAmount || !roomId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newPayment = new Payment({
      room_id: roomId,
      user_id: userId,
      paymentStatus: "Pending",
      paymentAmount: paymentAmount,
    });

    const savedPayment = await newPayment.save();

    const orderCode = Date.now();
    savedPayment.order_code = orderCode;

    savedPayment.paymentDescription =
      "Thanh toan don hang " + orderCode.toString();
    await savedPayment.save();

    const body = {
      orderCode: orderCode,
      amount: paymentAmount,
      description: orderCode,
      cancelUrl: `http://localhost:3001/cancel?orderCode=${orderCode}&status=CANCELLED`,
      returnUrl: `http://localhost:3001/success?orderCode=${orderCode}&status=SUCCESS`,
    };

    const paymentLinkRes = await payOS.createPaymentLink(body);

    //create entry
    const newEntry = new EntryHistory({
      entry_type: "Created",
      admin_id: req.user._id,
      description: "Payment QR for room " + roomId + ": created",
    });
    await newEntry.save();

    res.status(200).end(paymentLinkRes.checkoutUrl);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkPayment = async (req, res) => {
  try {
    const orderCode = req.params.orderCode;
    const status = req.body.status;
    const payment = await Payment.findOne({ order_code: orderCode });

    console.log("payment", payment);
    console.log("status", status);
    console.log("orderCode", orderCode);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (status === "SUCCESS") {
      payment.paymentStatus = "Paid";
      //set room status to false if room quantity is 0
      const room = await Room.findById(payment.room_id);
      if (room.room_quantity > 0) {
        room.room_quantity -= 1;
        await room.save();
      }
      await payment.save();
      console.log(status);
      res.status(200).json({ message: "Payment status success" });
    } else {
      payment.paymentStatus = "Cancelled";
      await payment.save();
      res.status(200).json({ message: "Payment status success" });
    }
  } catch (error) {
    console.error("Error checking payment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// exports.createPayment = async (req, res) => {
//   const roomId = req.params.roomId;
//   const username = req.body.username;
//   const userId = await User.findOne({ username: username }).select("_id");
//   const paymentAmount = req.body.paymentAmount;
//   const newPayment = new Payment({
//     room_id: roomId,
//     user_id: userId,
//     paymentStatus: "Pending",
//     paymentAmount: paymentAmount,
//   });

//   const savedPayment = await newPayment.save();
//   const paymentDescription = savedPayment._id;
//   savedPayment.paymentDescription = paymentDescription;
//   await savedPayment.save();

//   const myBankAccount = {
//     bankCode: config.bankCode,
//     accountNumber: config.bankAccountNumber,
//     accountName: config.bankAccountName,
//   };

//   const QR =
//     "https://img.vietqr.io/image/" +
//     myBankAccount.bankCode +
//     "-" +
//     myBankAccount.accountNumber +
//     "-compact2.png?amount=" +
//     paymentAmount +
//     "&addInfo=" +
//     paymentDescription +
//     "&accountName=" +
//     myBankAccount.accountName +
//     "&transactionId=" +
//     savedPayment._id;

//   res.status(200).end(QR);
// };

// exports.successPayment = async (req, res) => {
//   const orderCode = req.params.orderCode;
//   const payment = await Payment.findOne({ paymentDescription: orderCode });
// };

// exports.checkPayment = async (req, res) => {
//   const response = await fetch(
//     "https://script.googleusercontent.com/macros/echo?user_content_key=C7Z1yvwJQG5tFl06nhVeUkQnOzmtEBMbLRahVLvzZq5A0DTMdDv9VikAxEFp0TQZt2ELMu0I4sy-vqlDODcqLKwEDRSrkpuOm5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnF4KjlH-Pyntl_614xCGwzZglh0RXi6hNQXZvKrRiFa7Ea4keWEJHhc4fHt5MCrhqn_pjNYNWu6PYVJTNoYJzDut0T3wsCvMVdz9Jw9Md8uu&lib=Msro8575jvt4aJzZwmmC-QCx6JgJX9YoS"
//   );
//   const data = await response.json();
//   const paymentId = data.data[0].description.split(" ")[1];
//   const payment = await Payment.findById(paymentId);
//   if (payment) {
//     payment.paymentStatus = "Success";
//     await payment.save();
//     return res.status(200).json({ message: "Payment already successful" });
//   } else {
//     payment.paymentStatus = "Failed";
//     await payment.save();
//     return res.status(200).json({ message: "Payment status updated" });
//   }
// };
