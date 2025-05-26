const User = require("../Models/User");
const Landlord = require("../Models/Landlord");
const Room = require("../Models/Room");
const EntryHistory = require("../Models/EntryHistory");
const multer = require("multer");
const admin = require("firebase-admin");
const config = require("../Configuration/config");

const serviceAccount =
  require("../Configuration/firebaseConfig").serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: config.storage_bucket,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function uploadImageToStorage(file, folderPath) {
  const bucket = admin.storage().bucket();
  const blob = bucket.file(folderPath + file.originalname);
  const blobStream = blob.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });
  blobStream.on("error", (err) => {
    console.log(err);
  });
  blobStream.on("finish", async () => {
    await blob.makePublic();
  });
  blobStream.end(file.buffer);

  // Wait for the blob upload to complete
  await new Promise((resolve, reject) => {
    blobStream.on("finish", resolve);
    blobStream.on("error", reject);
  });

  // Return the public URL
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
  return publicUrl;
}

//Avatar for user
exports.uploadAvatarUser = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).send("User not found");
      }
      if (!req.file) {
        res.status(400).send("Please upload an image");
      }
      const imageUrl = await uploadImageToStorage(req.file, "Avatar/User/");
      user.avatarUrl = imageUrl;
      await user.save();
      //   res.status(200).send("Avatar uploaded");
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
];
//edit User Avatar
exports.editAvatarUser = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(404).send("User not found");
      }
      if (!req.file) {
        res.status(400).send("Please upload an image");
      }

      if (user.AvatarUrl) {
        const bucket = admin.storage().bucket();
        const oldFilename = user.AvatarUrl.split("/").pop();
        const oldFile = bucket.file("Avatar/User/" + oldFilename);

        //Delete old avatar
        await oldFile.delete().catch((err) => {
          console.log(err);
        });
      }

      const imageUrl = await uploadImageToStorage(req.file, "Avatar/User/");
      user.AvatarUrl = imageUrl;
      await user.save();
      //   res.status(200).send("Avatar uploaded");
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  },
];

//Avatar for landlord
exports.uploadAvatarLandlord = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const landlord = await Landlord.findById(req.params.id);
      if (!landlord) {
        res.status(404).send("Landlord not found");
      }
      if (!req.file) {
        res.status(400).send("Please upload an image");
      }
      const imageUrl = await uploadImageToStorage(req.file, "Avatar/Landlord/");
      landlord.avatarUrl = imageUrl;
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Created",
        description: "Landlord " + landlord._id + ": avatar uploaded.",
      });
      await newEntry.save();
      await landlord.save();
      //   res.status(200).send("Avatar uploaded");
      res.status(200).json(landlord);
    } catch (err) {
      next(err);
    }
  },
];
//Edit landlord Avatar
exports.editAvatarLandlord = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const landlord = await Landlord.findById(req.params.id);
      if (!landlord) {
        res.status(404).send("Landlord not found");
      }
      if (!req.file) {
        res.status(400).send("Please upload an image");
      }

      if (landlord.avatarUrl) {
        const bucket = admin.storage().bucket();
        const oldFilename = landlord.avatarUrl.split("/").pop();
        const oldFile = bucket.file("Avatar/Landlord/" + oldFilename);

        //Delete old avatar
        await oldFile.delete().catch((err) => {
          console.log(err);
        });
      }

      const imageUrl = await uploadImageToStorage(req.file, "Avatar/Landlord/");
      landlord.AvatarUrl = imageUrl;
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Updated",
        description: "Landlord " + landlord._id + ": avatar updated.",
      });
      await newEntry.save();
      await landlord.save();
      //   res.status(200).send("Avatar uploaded");
      res.status(200).json(landlord);
    } catch (err) {
      next(err);
    }
  },
];

//Room image
exports.uploadRoomImage = [
  upload.array("room"),
  async (req, res, next) => {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      res.status(404).send("Room not found");
    }
    try {
      const imageUrls = [];
      for (const file of req.files) {
        const url = await uploadImageToStorage(file, "Room/" + room.name + "/");
        imageUrls.push({ url: url });
      }
      room.images.push(...imageUrls);
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Created",
        description:
          "Room " + room._id + ": " + imageUrls.length + " images uploaded.",
      });
      await newEntry.save();
      const savedRoom = await room.save();
      res.status(200).json(savedRoom);
    } catch (err) {
      next(err);
    }
  },
];
exports.setMainImage = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      return res.status(404).send("Room not found");
    }

    const image = room.images.id(req.params.imageId);
    if (!image) {
      return res.status(404).send("Image not found");
    }

    // Set the main property for all images
    room.images.forEach((img) => {
      img.main = img._id.toString() === req.params.imageId; // Set the selected image as main
    });

    // Create a new entry in the history log
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Updated",
      description: `Room ${room._id}: set main image to ${image._id}`,
    });

    await newEntry.save(); // Save the history entry
    await room.save(); // Save the updated room

    res.status(200).json(room); // Respond with the updated room
  } catch (err) {
    next(err); // Handle any errors
  }
};

// //Set main image
// exports.setMainImage = async (req, res, next) => {
//   try {
//     const room = await Room.findById(req.params.roomId);
//     if (!room) {
//       res.status(404).send("Room not found");
//     }
//     const image = room.images.id(req.params.imageId);
//     if (!image) {
//       res.status(404).send("Image not found");
//     }

//     if (req.body.main === true) {
//       image.main = true;
//       const newEntry = new EntryHistory({
//         admin_id: req.user._id,
//         entry_type: "Updated",
//         description: "Room " + room._id + ": set main image " + image._id,
//       });
//       await newEntry.save();
//       await room.save();
//       res.status(200).json(room);
//     } else {
//       image.main = false;
//       const newEntry = new EntryHistory({
//         admin_id: req.user._id,
//         entry_type: "Updated",
//         description: "Room " + room._id + ": unset main image " + image._id,
//       });
//       await newEntry.save();
//       await room.save();
//       res.status(200).json(room);
//     }
//   } catch (err) {
//     next(err);
//   }
// };

//Set default image
exports.setDefaultImage = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      res.status(404).send("Room not found");
    }
    const image = room.images.id(req.params.imageId);
    if (!image) {
      res.status(404).send("Image not found");
    }

    const countImageDefault = room.images.filter((img) => img.default === true); //Count default image
    if (req.body.default === true) {
      if (countImageDefault.length == 5) {
        res.status(400).send("You can only set 5 default images");
      }
      image.default = true;
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Updated",
        description:
          "Room " + room._id + ": set default image " + image._id + " to true.",
      });
      await newEntry.save();
      await room.save();
      res.status(200).json(room);
    } else {
      image.default = false;
      const newEntry = new EntryHistory({
        admin_id: req.user._id,
        entry_type: "Updated",
        description:
          "Room " +
          room._id +
          ": set default image " +
          image._id +
          " to false.",
      });
      await newEntry.save();
      await room.save();
      res.status(200).json(room);
    }
  } catch (err) {
    next(err);
  }
};

//Delete room image
exports.deleteRoomImage = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) {
      res.status(404).send("Room not found");
    }
    const image = room.images.id(req.params.imageId);
    if (!image) {
      res.status(404).send("Image not found");
    }

    const bucket = admin.storage().bucket();
    const filename = image.url.split("/").pop();
    const file = bucket.file("Room/" + room.name + "/" + filename);
    //Delete image
    await file.delete().catch((err) => {
      console.log(err);
    });
    image.deleteOne();
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Updated",
      description: "Room " + room._id + ": deleted image " + image._id,
    });
    await newEntry.save();
    await room.save();
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};
