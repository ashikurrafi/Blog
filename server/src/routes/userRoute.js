import express from 'express'; // Importing express to create the API router

import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUserProfile,
} from '../controllers/userController.js';

import authenticate from '../middleware/authMiddleware.js';

import { singleUpload } from '../middleware/multer.js';

const userRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
userRouter.get('/getAllUsers', getAllUsers);
userRouter.get('/getUserById/:id', getUserById);
userRouter.patch(
  '/updateUser/:userId',
  authenticate,
  singleUpload,
  updateUserProfile,
);
userRouter.delete('/deleteUser/:id', authenticate, deleteUser);
// Exporting the router so it can be used in other files
export default userRouter;
