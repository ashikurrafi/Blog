const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  userProfileByID,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfileByID);

module.exports = router;
