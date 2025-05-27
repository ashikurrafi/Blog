import express from "express"; // Importing express to create the API router

const authRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
authRouter.post("/registerUser", (req, res) => {
  res.status(200).json({
    message: "User registered successfully",
  });
});
// Exporting the router so it can be used in other files
export default authRouter;
