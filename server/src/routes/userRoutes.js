const express = require("express");
const router = express.Router();

const { registerUser } = require("../controllers/userControllers");

router.post("/register", registerUser);

module.exports = router;
