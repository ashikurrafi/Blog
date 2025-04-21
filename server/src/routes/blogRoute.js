const express = require("express"); // Importing express to create the API router
const {
  createBlog,
  deleteBlog,
  updateBlog,
} = require("../controllers/blogController");

const blogRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
blogRouter.post("/createBlog", createBlog);
blogRouter.put("/updateBlog/:id", updateBlog);
blogRouter.delete("/deleteBlog/:id", deleteBlog);

// Exporting the router so it can be used in other files
module.exports = blogRouter;
