const express = require("express");
const router = express.Router();
const { authGuard } = require("../middlewares/authMiddleware");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers");

router.post("/", authGuard, createComment);
router.put("/:commentId", authGuard, updateComment);
router.delete("/:commentId", authGuard, deleteComment);

module.exports = router;
