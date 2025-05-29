import express from "express"; // Importing express to create the API router
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blogController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";

const blogRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
blogRouter.post(
  "/createBlog",
  isAuthenticated,
  upload.single("imageBlog"),
  createBlog
);
blogRouter.delete("/deleteBlog/:id", isAuthenticated, deleteBlog);
blogRouter.get("/getAllBlogs", getAllBlogs);
blogRouter.patch(
  "/updateBlog/:id",
  isAuthenticated,
  upload.single("imageBlog"),
  updateBlog
);
blogRouter.get("/getBlogById/:id", getBlogById);

// Exporting the router so it can be used in other files
export default blogRouter;
