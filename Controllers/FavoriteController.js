const Favorite = require("../Models/Favorite");
const Room = require("../Models/Room");
const User = require("../Models/User");

exports.addFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const favorite = await Favorite.findOne({ user: req.user._id });
    if (favorite) {
      if (favorite.room.includes(req.params.id)) {
        return res
          .status(400)
          .json({ message: "Room already in favorite list" });
      }
      favorite.room.push(req.params.id);
      await favorite.save();
    } else {
      const newFavorite = new Favorite({
        user: req.user._id,
        room: [req.params.id],
      });
      await newFavorite.save();
    }
    res.status(200).json({ message: "Room added to favorite list" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.getFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }
    const rooms = await Room.find({ _id: { $in: favorite.room } });
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms in favorite list" });
    }
    const favoriteList = {
      user: req.user._id,
      rooms: rooms || [],
    };
    res.status(200).json(favoriteList);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite list not found" });
    }
    if (!favorite.room.includes(req.params.id)) {
      return res.status(400).json({ message: "Room not in favorite list" });
    }
    favorite.room = favorite.room.filter((room) => room != req.params.id); //lọc ra những phần tử khác với id của phòng cần xóa
    await favorite.save();
    res.status(200).json({ message: "Room removed from favorite list" });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
