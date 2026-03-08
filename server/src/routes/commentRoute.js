import express from 'express';

import {
  createComment,
  deleteComment,
  getAllComment,
  getAllCommentsOnMyBlogs,
  getBlogComments,
  updateComment,
} from '../controllers/commentController.js';

import authenticate from '../middleware/authMiddleware.js';

const commentRouter = express.Router();

commentRouter.post('/createComment/:postId', authenticate, createComment);
commentRouter.patch('/updateComment/:commentId', authenticate, updateComment);
commentRouter.delete('/deleteComment/:commentId', authenticate, deleteComment);
commentRouter.get('/getAllComment', authenticate, getAllComment);
commentRouter.get('/getBlogComments/:postId', authenticate, getBlogComments);
commentRouter.get(
  '/getAllCommentsOnMyBlogs',
  authenticate,
  getAllCommentsOnMyBlogs,
);

export default commentRouter;
