const express = require("express"); // Importing express to create the API router
const {
  registerUser,
  verifyOTP,
  loginUser,
  logoutUser,
  getUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const isAuthenticated = require("../middlewares/authMiddlewares");
const authRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
authRouter.post("/registerUser", registerUser);
authRouter.post("/verifyOTP", verifyOTP);
authRouter.post("/loginUser", loginUser);
authRouter.post("/logoutUser", isAuthenticated, logoutUser);
authRouter.get("/getUser", isAuthenticated, getUser);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.put("/resetPassword/:token", resetPassword);
// Exporting the router so it can be used in other files
module.exports = authRouter;
