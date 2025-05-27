import express from "express"; // Importing express to create the API router
import { loginUser, registerUser } from "../controllers/authController.js";
// import upload from "../middlewares/multer.js";

const authRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
// authRouter.post("/registerUser", upload.single("profilePicture"), registerUser);
authRouter.post("/registerUser", registerUser);
authRouter.post("/loginUser", loginUser);

// Exporting the router so it can be used in other files
export default authRouter;
