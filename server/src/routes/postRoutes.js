const express = require("express");
const {
  createPost,
  updatePost,
  deletePost,
  getPost,
} = require("../controllers/postControllers");
const { authGuard, adminGuard } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authGuard, adminGuard, createPost);
router
  .route("/:slug")
  .put(authGuard, adminGuard, updatePost)
  .delete(authGuard, adminGuard, deletePost)
  .get(getPost);

module.exports = router;
