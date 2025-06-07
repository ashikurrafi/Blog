import express from "express"; // Importing express to create the API router

import { updateUser } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const userRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
userRouter.patch(
  "/update",
  isAuthenticated,
  upload.single("imageUser"),
  updateUser
);

// Exporting the router so it can be used in other files
export default userRouter;
