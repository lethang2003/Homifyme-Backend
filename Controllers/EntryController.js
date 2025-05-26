const EntryHistory = require("../Models/EntryHistory");
const auth = require("../loaders/authenticate");
const User = require("../Models/User");
//view list entry history
exports.allEntryHistory = async (req, res, next) => {
  try {
    const entryHistory = await EntryHistory.find({});
    if (entryHistory.length === 0) {
      return res.status(404).json({ message: "No entry history found" });
    }
    const history = [];
    for (const entry of entryHistory) {
      const admin = await User.findById(entry.admin_id);
      history.push({
        _id: entry._id,
        entry_date: entry.entry_date,
        entry_type: entry.entry_type,
        description: entry.description,
        admin: admin,
      });
    }
    console.log(history);
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};

//view entry history by id
exports.getEntryHistory = async (req, res, next) => {
  try {
    const entryHistory = await EntryHistory.findById(req.params.id);
    if (!entryHistory) {
      return res.status(404).json({ message: "Entry history not found" });
    }
    res.status(200).json(entryHistory);
  } catch (err) {
    next(err);
  }
};
