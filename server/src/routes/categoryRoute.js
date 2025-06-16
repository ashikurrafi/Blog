import express from "express"; // Importing express to create the API router
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/categoryController.js";
import isAdmin from "../middlewares/isAdmin.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const categoryRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
categoryRouter.post(
  "/createCategory",
  isAuthenticated,
  isAdmin,
  createCategory
);

categoryRouter.get("/getAllCategories", isAuthenticated, getAllCategories);

categoryRouter.put(
  "/updateCategory/:id",
  isAuthenticated,
  isAdmin,
  updateCategory
);

categoryRouter.delete(
  "/deleteCategory/:id",
  isAuthenticated,
  isAdmin,
  deleteCategory
);

// Exporting the router so it can be used in other files
export default categoryRouter;
