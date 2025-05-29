import express from "express"; // Importing express to create the API router
import {
  createComment,
  deleteComment,
  editComment,
} from "../controllers/commentController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const commentRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
commentRouter.post("/addcomment", isAuthenticated, createComment);
commentRouter.patch("/editcomment/:id", isAuthenticated, editComment);
commentRouter.delete("/deletecomment/:id", isAuthenticated, deleteComment);
// Exporting the router so it can be used in other files
export default commentRouter;
