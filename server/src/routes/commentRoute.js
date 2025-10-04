import express from "express"; // Importing express to create the API router

import {
  createComment,
  deleteComment,
  getAllComment,
  getAllCommentsOnMyBlogs,
  getBlogComments,
  updateComment,
} from "../controllers/commentController.js"; // Importing controller functions for handling requests

import authenticate from "../middleware/authMiddleware.js";

const commentRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
commentRouter.post("/createComment/:postId", authenticate, createComment);
commentRouter.patch("/updateComment/:commentId", authenticate, updateComment);
commentRouter.delete("/deleteComment/:commentId", authenticate, deleteComment);
commentRouter.get("/getAllComment", getAllComment);
commentRouter.get("/getBlogComments/:postId", getBlogComments);
commentRouter.get(
  "/getAllCommentsOnMyBlogs",
  authenticate,
  getAllCommentsOnMyBlogs
);

// Exporting the router so it can be used in other files
export default commentRouter;
