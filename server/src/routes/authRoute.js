import express from "express"; // Importing express to create the API router
import { registerUser } from "../controllers/authController.js";

const authRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
authRouter.post("/registerUser", registerUser);

// Exporting the router so it can be used in other files
export default authRouter;
