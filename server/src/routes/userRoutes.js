const express = require("express");
const router = express.Router();
const { authGuard, adminGuard } = require("../middlewares/authMiddleware");
const {
  registerUser,
  loginUser,
  userProfileByID,
  updateUserProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
} = require("../controllers/userControllers");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authGuard, userProfileByID);
router.put("/updateProfile", authGuard, updateUserProfile);
router.put("/updateProfilePicture", authGuard, updateProfilePicture);
router.get("/", authGuard, adminGuard, getAllUsers);
router.delete("/:userId", authGuard, adminGuard, deleteUser);

module.exports = router;
