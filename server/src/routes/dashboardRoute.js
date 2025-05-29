import express from "express"; // Importing express to create the API router
import {
  deleteBlog,
  deleteUser,
  getAllBlogs,
  getAllData,
  getAllUsers,
} from "../controllers/dashboardController.js";
import isAdmin from "../middlewares/isAdmin.js"; // Importing the isAdmin middleware for route protection

const dashboardRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
dashboardRouter.get("/", isAdmin, getAllData);
dashboardRouter.get("/blogs", isAdmin, getAllBlogs);
dashboardRouter.get("/users", isAdmin, getAllUsers);
dashboardRouter.delete("/delete/user/:id", isAdmin, deleteUser);
dashboardRouter.delete("/delete/blog/:id", isAdmin, deleteBlog);

// dashboardRouter.get("/comments", isAdmin, getAllComments);
// dashboardRouter.delete("/delete/comment/:id", isAdmin, deleteComment);

// Exporting the router so it can be used in other files
export default dashboardRouter;
