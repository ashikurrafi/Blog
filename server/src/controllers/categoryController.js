import ApiError from '../errors/apiError.js';
import ApiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import Blog from '../models/blogModel.js';
import Category from '../models/categoryModel.js';

// Helper to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Get all categories
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res
    .status(200)
    .json(new ApiResponse(200, categories, 'Categories fetched successfully'));
});

// Get category by slug
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  res
    .status(200)
    .json(new ApiResponse(200, category, 'Category fetched successfully'));
});

// Create category (admin only)
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    throw new ApiError(400, 'Category name is required');
  }

  const slug = generateSlug(name);

  // Check if category already exists
  const existingCategory = await Category.findOne({
    $or: [{ name }, { slug }],
  });

  if (existingCategory) {
    throw new ApiError(400, 'Category already exists');
  }

  const category = await Category.create({
    name,
    slug,
    description: description || '',
  });

  res
    .status(201)
    .json(new ApiResponse(201, category, 'Category created successfully'));
});

// Update category (admin only)
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (name) {
    const slug = generateSlug(name);

    // Check if another category has this name/slug
    const existingCategory = await Category.findOne({
      _id: { $ne: id },
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      throw new ApiError(400, 'Category name already exists');
    }

    category.name = name;
    category.slug = slug;
  }

  if (description !== undefined) {
    category.description = description;
  }

  await category.save();

  res
    .status(200)
    .json(new ApiResponse(200, category, 'Category updated successfully'));
});

// Delete category (admin only)
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Update blogs to remove this category
  await Blog.updateMany({ category: id }, { $unset: { category: 1 } });

  await Category.findByIdAndDelete(id);

  res
    .status(200)
    .json(new ApiResponse(200, null, 'Category deleted successfully'));
});

// Get posts by category
export const getPostsByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  const [posts, total] = await Promise.all([
    Blog.find({ category: category._id, status: 'published' })
      .populate('author', 'name')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Blog.countDocuments({ category: category._id, status: 'published' }),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        posts,
        category,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      'Posts fetched successfully',
    ),
  );
});
