import express from "express"; // Importing express to create the API router

import {
  createAdminToUser,
  createUserToAdmin,
  deleteAdmin,
  deleteUserByAdmin,
  getAdminById,
  getAllAdmins,
  updateAdmin,
  updateUserByAdmin,
} from "../controllers/adminController.js"; // Importing controller functions for handling requests

import authenticate from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdminMiddleware.js";

import { singleUpload } from "../middleware/multer.js";

const adminRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
adminRouter.patch(
  "/createUserToAdmin/:userId",
  authenticate,
  isAdmin,
  createUserToAdmin
);
adminRouter.patch(
  "/createAdminToUser/:adminId",
  authenticate,
  isAdmin,
  createAdminToUser
);
adminRouter.delete(
  "/deleteUserByAdmin/:userId",
  authenticate,
  isAdmin,
  deleteUserByAdmin
);
adminRouter.patch(
  "/updateUserByAdmin/:userId",
  authenticate,
  isAdmin,
  singleUpload,
  updateUserByAdmin
);
adminRouter.get("/getAllAdmins", authenticate, isAdmin, getAllAdmins);
adminRouter.get("/getAdminById/:id", authenticate, isAdmin, getAdminById);
adminRouter.delete("/deleteAdmin/:adminId", authenticate, isAdmin, deleteAdmin);
adminRouter.patch(
  "/updateAdmin/:adminId",
  authenticate,
  isAdmin,
  singleUpload,
  updateAdmin
);
// Exporting the router so it can be used in other files
export default adminRouter;
