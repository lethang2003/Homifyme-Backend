const Landlord = require("../Models/Landlord");
const auth = require("../loaders/authenticate");
const EntryHistory = require("../Models/EntryHistory");

//view list landlord
exports.allLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.find({});
    if (landlord.length === 0) {
      return res.status(404).json({ message: "No landlord found" });
    }
    res.status(200).json(landlord);
  } catch (err) {
    next(err);
  }
};

//view landlord by id
exports.getLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }
    res.status(200).json(landlord);
  } catch (err) {
    next(err);
  }
};

//create landlord
exports.createLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.findOne({ email: req.body.email });
    if (landlord) {
      return res.status(400).json({ message: "Landlord already exists" });
    }
    const newLandlord = new Landlord(req.body);

    const savedLanlord = await newLandlord.save();
    console.log("Landlord created successfully!", savedLanlord);
    console.log("Admin:", req.user);
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Created",
      description: "Landlord " + savedLanlord._id + ": created",
    });

    await newEntry.save();
    res.status(201).json(newLandlord);
  } catch (err) {
    next(err);
  }
};

// exports.createLandlord = async (req, res, next) => {
//   try {
//     const landlord = await Landlord.findOne({ email: req.body.email });
//     if (landlord) {
//       return res.status(400).json({ message: "Landlord already exists" });
//     }
//     const newLandlord = new Landlord(req.body);
//     const savedLandlord = await newLandlord.save();
//     res.status(201).json(savedLandlord);
//   } catch (err) {
//     console.error('Error:', err.message);
//     next(err);
//   }
// };

// //update landlord
// exports.updateLandlord = async (req, res, next) => {
//   try {
//     const landlord = await Landlord.findById(req.params.id);
//     if (!landlord) {
//       return res.status(404).json({ message: "Landlord not found" });
//     }
//     await Landlord.findByIdAndUpdate(req.params.id, req.body);
//     const newEntry = new EntryHistory({
//       admin_id: req.user._id,
//       entry_type: "Updated",
//       description: "Landlord " + landlord._id + ": updated",
//     });
//     await newEntry.save();
//     res.status(200).json({ message: "Landlord updated" });
//   } catch (err) {
//     next(err);
//   }
// };
// update landlord with specific fields
exports.updateLandlord = async (req, res, next) => {
  try {
    // Find the landlord by ID
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }

    // Update only specific fields from the request body
    const { fullname, email, gender, dayOfBirth, phone, address } = req.body;

    // Assign the updated values to the landlord fields
    landlord.fullname = fullname || landlord.fullname;
    landlord.email = email || landlord.email;
    landlord.gender = gender || landlord.gender;
    landlord.dayOfBirth = dayOfBirth || landlord.dayOfBirth;
    landlord.phone = phone || landlord.phone;
    landlord.address = address || landlord.address;

    // Save the updated landlord information
    await landlord.save();

    // Log the update in EntryHistory
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Updated",
      description: `Landlord ${landlord._id}: updated`,
    });
    await newEntry.save();

    // Respond with a success message
    res.status(200).json({ message: "Landlord updated successfully" });
  } catch (err) {
    // Handle errors
    next(err);
  }
};


//delete landlord
exports.deleteLandlord = async (req, res, next) => {
  try {
    const landlord = await Landlord.findById(req.params.id);
    if (!landlord) {
      return res.status(404).json({ message: "Landlord not found" });
    }
    await Landlord.findByIdAndDelete(req.params.id);
    const newEntry = new EntryHistory({
      admin_id: req.user._id,
      entry_type: "Updated",
      description: "Landlord " + landlord._id + ": deleted",
    });
    await newEntry.save();
    res.status(200).json({ message: "Landlord deleted" });
  } catch (err) {
    next(err);
  }
};
