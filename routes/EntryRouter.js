const express = require("express");
const EntryRouter = express.Router();
const EntryController = require("../Controllers/EntryController");
const auth = require("../loaders/authenticate");
const cors = require("../loaders/cors");

EntryRouter.get("/", cors.cors, EntryController.allEntryHistory);
EntryRouter.get("/:id", cors.cors, EntryController.getEntryHistory);

module.exports = EntryRouter;
