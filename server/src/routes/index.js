import express from "express"; // Importing required modules
import apiRouter from "./api.js"; // Importing the router for the API endpoints

const router = express.Router(); // Creating an instance of the router

router.use("/api/v1/demo", apiRouter); // Defining a route to handle requests to /api/v1/demo

export default router; // Exporting the router so it can be used in other files
