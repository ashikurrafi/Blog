const express = require("express");
const userApiRouter = require("./userRoutes");
const postApiRouter = require("./postRoutes");
const commentApiRouter = require("./commentRoutes");

const router = express.Router();

router.use("/api/v1/user", userApiRouter);
router.use("/api/v1/post", postApiRouter);
router.use("/api/v1/comment", commentApiRouter);

module.exports = router;
