import express from 'express';
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogByUser,
  getMyBlogs,
  getPublicBlogs,
  updateBlog,
} from '../controllers/blogController.js';

import authenticate from '../middleware/authMiddleware.js';
import { singleUpload } from '../middleware/multer.js';

const blogRouter = express.Router();

// Public routes
blogRouter.get('/public', getPublicBlogs);
blogRouter.get('/slug/:slug', getBlogBySlug);
blogRouter.get('/author/:userId', getBlogByUser);

// Protected routes
blogRouter.post('/createBlog', authenticate, singleUpload, createBlog);
blogRouter.patch('/updateBlog/:id', authenticate, singleUpload, updateBlog);
blogRouter.delete('/deleteBlog/:id', authenticate, deleteBlog);
blogRouter.get('/getBlog/:id', authenticate, getBlogById);
blogRouter.get('/getAllBlogs', authenticate, getAllBlogs);
blogRouter.get('/myBlogs', authenticate, getMyBlogs);
blogRouter.get('/getBlogByUser/:userId', authenticate, getBlogByUser);

export default blogRouter;
