const Room = require("../Models/Room");
const EntryHistory = require("../Models/EntryHistory");
const Payment = require("../Models/Payment");

exports.getAllComments = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const room = await Room.findById(roomId).populate(
      "comments.user_id",
      "username _id avatarUrl fullName"
    );
    
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    
    // Logging the populated room details
    console.log("Room Data:", JSON.stringify(room, null, 2));
    
    // Logging the comments with populated user details
    room.comments.forEach(comment => {
      console.log("User Full Name:", comment.user_id.fullName || "No full name available");
      console.log("Avatar URL:", comment.user_id.avatarUrl || "No avatar available");
    });
    
    res.status(200).json(room);
  } catch (error) {
    console.error("Error getting all comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.addComment = async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.user._id;
  const content = req.body.content;
  const rating = req.body.rating;
  try {
    const payment = await Payment.findOne({ user_id: userId, room_id: roomId });
    if (!payment) {
      return res
        .status(404)
        .json({ message: "Can not comment if you not rent this room" });
    } else if (payment.paymentStatus === "Cancelled") {
      return res
        .status(404)
        .json({ message: "Can not comment if you not rent this room" });
    } else {
      const room = await Room.findById(roomId).populate(
        "comments.user_id",
        "username _id"
      );
      // Check if the user has already commented
    const hasCommented = room.comments.some((comment) => {
      // Check if user_id is an object (populated) or a string and compare accordingly
      return (
        (comment.user_id._id && comment.user_id._id.toString() === userId.toString()) ||
        (comment.user_id && comment.user_id.toString() === userId.toString())
      );
    });

    if (hasCommented) {
      return res.status(404).json({ message: "You can only comment on this room one time" });
    }

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      const newComment = {
        user_id: userId,
        content: content,
        rating: rating,
      };
      room.comments.push(newComment);

      let total = 0;
      for (let i = 0; i < room.comments.length; i++) {
        total += room.comments[i].rating;
      }
      room.total_rating = total / room.comments.length;

      await room.save();
      res.status(200).json(room);
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteComment = async (req, res) => {
  const roomId = req.params.roomId;
  const commentId = req.params.commentId;
  try {
    const room = await Room.findById(roomId).populate(
      "comments.user_id",
      "username _id"
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const comment = room.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    comment.remove();
    await room.save();
    res.status(200).json(room);
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
