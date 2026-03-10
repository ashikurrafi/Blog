import express from 'express'; // Importing express to create the API router

import {
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authController.js';

const authRouter = express.Router(); // Creating an instance of the router

// Auth routes
authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);
authRouter.post('/logout', logoutUser);

// Exporting the router so it can be used in other files
export default authRouter;
