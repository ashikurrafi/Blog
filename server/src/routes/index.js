const express = require("express");
const userApiRouter = require("./userRoutes");
const postApiRouter = require("./postRoutes");

const router = express.Router();

router.use("/api/v1/user", userApiRouter);
router.use("/api/v1/post", postApiRouter);

module.exports = router;
