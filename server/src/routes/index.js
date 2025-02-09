const express = require("express");
const userApiRouter = require("./userRoutes");

const router = express.Router();

router.use("/api/v1/user", userApiRouter);

module.exports = router;
