const express = require("express");
const router = express.Router();
const CommentController = require("../Controllers/CommentController");
const auth = require("../loaders/authenticate");

router.get("/:roomId", CommentController.getAllComments);
router.post("/:roomId", auth.verifyUser, CommentController.addComment);
router.delete(
  "/:roomId/:commentId",
  auth.verifyUser,
  CommentController.deleteComment
);

module.exports = router;
