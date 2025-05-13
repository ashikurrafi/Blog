const express = require("express"); // Importing express to create the API router
const authRouter = require("./authRoute");

const router = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path

router.use("/auth", authRouter);

// Exporting the router so it can be used in other files
module.exports = router;
