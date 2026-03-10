import express from 'express';

import {
  createAdminToUser,
  createUserToAdmin,
  deleteAdmin,
  deleteUserByAdmin,
  getAdminById,
  getAllAdmins,
  updateAdmin,
  updateUserByAdmin,
} from '../controllers/adminController.js';

import authenticate from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdminMiddleware.js';
import { singleUpload } from '../middleware/multer.js';

const adminRouter = express.Router();

// role management
adminRouter.patch(
  '/createUserToAdmin/:userId',
  authenticate,
  isAdmin,
  createUserToAdmin,
);
adminRouter.patch(
  '/createAdminToUser/:adminId',
  authenticate,
  isAdmin,
  createAdminToUser,
);
// user management by admin
adminRouter.delete(
  '/deleteUserByAdmin/:userId',
  authenticate,
  isAdmin,
  deleteUserByAdmin,
);
adminRouter.patch(
  '/updateUserByAdmin/:userId',
  authenticate,
  isAdmin,
  singleUpload,
  updateUserByAdmin,
);

// admin CRUD
adminRouter.get('/getAllAdmins', authenticate, isAdmin, getAllAdmins);
adminRouter.get('/getAdminById/:id', authenticate, isAdmin, getAdminById);
adminRouter.delete('/deleteAdmin/:adminId', authenticate, isAdmin, deleteAdmin);
adminRouter.patch(
  '/updateAdmin/:adminId',
  authenticate,
  isAdmin,
  singleUpload,
  updateAdmin,
);

export default adminRouter;
