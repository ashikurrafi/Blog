const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  userProfileByID,
  updateUserProfile,
  updateProfilePicture,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfileByID);
router.put("/updateProfile", authGuard, updateUserProfile);
router.put("/updateProfilePicture", authGuard, updateProfilePicture);

module.exports = router;
