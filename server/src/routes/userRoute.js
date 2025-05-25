const express = require("express"); // Importing express to create the API router

const isAuthenticated = require("../middlewares/authMiddlewares");
const upload = require("../middlewares/multer");
const { updateProfile, getUser } = require("../controllers/userController");

const userRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
userRouter.get("/getUser", isAuthenticated, getUser);
userRouter.put("/profile/:id", isAuthenticated, upload, updateProfile);

// Exporting the router so it can be used in other files
module.exports = userRouter;
