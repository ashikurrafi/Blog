const express = require("express");
const userApiRouter = require("./userRoutes");
const postApiRouter = require("./postRoutes");
const commentRoutes = require("./commentRoutes");
const PostCategories = require("./postCategoriesRoutes");

const router = express.Router();

router.use("/api/v1/user", userApiRouter);
router.use("/api/v1/post", postApiRouter);
router.use("/api/v1/comments", commentRoutes);
router.use("/api/v1/comments", PostCategories);

module.exports = router;
