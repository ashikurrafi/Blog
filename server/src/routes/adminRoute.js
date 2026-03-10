import express from 'express';

import {
  createAdminToUser,
  createUserToAdmin,
  deleteAdmin,
  deleteUserByAdmin,
  deleteUserById,
  getAdminById,
  getAllAdmins,
  getAllUsers,
  toggleUserRole,
  updateAdmin,
  updateUserByAdmin,
} from '../controllers/adminController.js';

import authenticate from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdminMiddleware.js';
import { singleUpload } from '../middleware/multer.js';

const adminRouter = express.Router();

// User management (new simplified endpoints)
adminRouter.get('/users', authenticate, isAdmin, getAllUsers);
adminRouter.patch('/users/:userId/role', authenticate, isAdmin, toggleUserRole);
adminRouter.delete('/users/:userId', authenticate, isAdmin, deleteUserById);

// role management (legacy)
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
// user management by admin (legacy)
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
