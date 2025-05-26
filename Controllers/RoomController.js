const Room = require("../Models/Room");
const EntryHistory = require("../Models/EntryHistory");

exports.sortAll = async (req, res) => {
  try {
    const ward = req.body.ward;
    const district = req.body.district;
    const minPrice = req.body.minPrice;
    const maxPrice = req.body.maxPrice;
    const minRating = req.body.minRating;
    let rooms;
    if (!ward) {
      rooms = await Room.find({ status: true })
        .where("address.district")
        .equals(district)
        .where("price")
        .gte(minPrice)
        .lte(maxPrice)
        .where("total_rating")
        .gte(minRating)
        .lte(5);
      if (rooms.length === 0) {
        return res.status(404).json({ message: "No rooms found" });
      }
    } else if (!ward || !district) {
      rooms = await Room.find({ status: true })
        .where("price")
        .gte(minPrice)
        .lte(maxPrice)
        .where("total_rating")
        .gte(minRating)
        .lte(5);
      if (rooms.length === 0) {
        return res.status(404).json({ message: "No rooms found" });
      }
    } else {
      rooms = await Room.find({ status: true })
        .where("address.ward")
        .equals(ward)
        .where("address.district")
        .equals(district)
        .where("price")
        .gte(minPrice)
        .lte(maxPrice)
        .where("total_rating")
        .gte(minRating)
        .lte(5);

      if (rooms.length === 0) {
        return res.status(404).json({ message: "No rooms found" });
      }
    }
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({});
    if (rooms.length === 0) {
      return res.status(404).json({ message: "No rooms found" });
    }
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: true });
    // if (rooms.length === 0) {
    //   return res.status(404).json({ message: "No rooms found" });
    // }
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controllers/RoomController.js

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate(
      "comments.user_id",
      "username _id"
    );
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getRoomsByLandlord = async (req, res) => {
  try {
    const landlordId = req.params.id; // Extract landlord ID from route parameters
    const rooms = await Room.find({ landlord_id: landlordId }).populate(
      "comments.user_id",
      "username _id"
    ); // Query rooms by landlord ID

    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms found for this landlord" });
    }

    res.status(200).json(rooms);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.body.name });
    if (room) {
      return res.status(400).json({ message: "Room already exists" });
    }

    const address = {
      detail: req.body.address?.[0]?.detail || "",
      ward: req.body.address?.[0]?.ward,
      district: req.body.address?.[0]?.district,
    };

    const newRoom = new Room({ ...req.body, address: [address] });
    const savedRoom = await newRoom.save();
    const newEntry = new EntryHistory({
      entry_type: "Created",
      admin_id: req.user._id,
      description: "Room " + savedRoom._id + ": created",
    });
    await newEntry.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Room.findByIdAndUpdate(req.params.id, req.body);
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Updated",
      description: "Room " + room._id + ": updated",
    });
    await newEntry.save();
    res.status(200).json({ message: "Room updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const oldQuantity = room.room_quantity;
    await Room.findByIdAndUpdate(req.params.id, {
      room_quantity: req.body.room_quantity,
    });
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Updated",
      description:
        "Room " +
        room._id +
        ": quantity updated from " +
        oldQuantity +
        " to " +
        req.body.room_quantity,
    });
    await newEntry.save();
    res.status(200).json({
      message:
        "Room " +
        room._id +
        ": quantity updated successfully from " +
        oldQuantity +
        " to " +
        req.body.room_quantity,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.setStatus = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Room.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    var updatedValue = req.body.status ? true : false;
    if (updatedValue) {
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Updated",
        description: "Room " + room._id + ": status updated to true",
      });
      await newEntry.save();
    } else {
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Updated",
        description: "Room " + room._id + ": status updated to false",
      });
      await newEntry.save();
    }
    res.status(200).json({ message: "Room status updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    await Room.findByIdAndDelete(req.params.id);
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Deleted",
      description: "Room " + room._id + ": deleted",
    });
    await newEntry.save();
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};
