import express from 'express'; // Importing express to create the API router

import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogByUser,
  updateBlog,
} from '../controllers/blogController.js';

import authenticate from '../middleware/authMiddleware.js';

import { singleUpload } from '../middleware/multer.js';

const blogRouter = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
blogRouter.post('/createBlog', authenticate, singleUpload, createBlog);
blogRouter.patch('/updateBlog/:id', authenticate, singleUpload, updateBlog);
blogRouter.delete('/deleteBlog/:id', authenticate, deleteBlog);
blogRouter.get('/getBlog/:id', authenticate, getBlogById);
blogRouter.get('/getAllBlogs', getAllBlogs);
blogRouter.get('/getBlogByUser/:userId', getBlogByUser);

// Exporting the router so it can be used in other files
export default blogRouter;
