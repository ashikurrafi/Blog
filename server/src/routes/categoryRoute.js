import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryBySlug,
  getPostsByCategory,
  updateCategory,
} from '../controllers/categoryController.js';
import authenticate from '../middleware/authMiddleware.js';
import isAdmin from '../middleware/isAdminMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:slug/posts', getPostsByCategory);

// Admin routes
router.post('/', authenticate, isAdmin, createCategory);
router.put('/:id', authenticate, isAdmin, updateCategory);
router.delete('/:id', authenticate, isAdmin, deleteCategory);

export default router;
