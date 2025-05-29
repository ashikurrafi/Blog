import express from "express"; // Importing express to create the API router
import authRouter from "./authRoute.js";
import blogRouter from "./blogRoute.js";
import dashboardRouter from "./dashboardRoute.js";

const router = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path

router.use("/auth", authRouter);
router.use("/blog", blogRouter);
router.use("/dashboard", dashboardRouter);

// Exporting the router so it can be used in other files
export default router;
