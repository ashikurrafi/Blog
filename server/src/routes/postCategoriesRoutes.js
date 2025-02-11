const express = require("express");
const router = express.Router();

const { authGuard, adminGuard } = require("../middlewares/authMiddleware");
const {
  createPostCategory,
  getAllPostCategories,
  getSingleCategory,
  updatePostCategory,
  deletePostCategory,
} = require("../controllers/postCategoriesController");

router
  .route("/")
  .post(authGuard, adminGuard, createPostCategory)
  .get(getAllPostCategories);
router
  .route("/:postCategoryId")
  .get(getSingleCategory)
  .put(authGuard, adminGuard, updatePostCategory)
  .delete(authGuard, adminGuard, deletePostCategory);

module.exports = router;
