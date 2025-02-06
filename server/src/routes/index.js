const express = require("express");
const apiRouter = require("./api");

const router = express.Router();

router.use("/api/v1/demo", apiRouter);

module.exports = router;
