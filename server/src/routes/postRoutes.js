const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middlewares/authMiddleware");
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
} = require("../controllers/postControllers");

router.post("/", authGuard, adminGuard, createPost);
router.put("/:slug", authGuard, adminGuard, updatePost);
router.delete("/:slug", authGuard, adminGuard, deletePost);
router.get("/:slug", getPost);
router.get("/", getAllPosts);

module.exports = router;
