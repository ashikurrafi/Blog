const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middlewares/authMiddleware");
const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers");

router
  .route("/")
  .post(authGuard, createComment)
  .get(authGuard, adminGuard, getAllComments);
router
  .route("/:commentId")
  .put(authGuard, updateComment)
  .delete(authGuard, deleteComment);
module.exports = router;
