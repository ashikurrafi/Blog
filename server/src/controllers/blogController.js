import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import { cascadeDeleteBlog } from '../utils/cascadeDelete.js';
import cloudinary, { deleteFromCloudinary } from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

// Helper to generate slug
const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Date.now().toString(36)
  );
};

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, excerpt, category, tags, status } = req.body;
  const user = req.user;

  if (!title || !content) {
    throw new apiError(400, 'Title and content are required');
  }

  const slug = generateSlug(title);

  let coverImage = '';
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const upload = await cloudinary.uploader.upload(fileUri);
    coverImage = upload.secure_url;
  }

  // Parse tags if it's a string
  let parsedTags = [];
  if (tags) {
    parsedTags =
      typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : tags;
  }

  const blog = await blogModel.create({
    title,
    slug,
    content,
    excerpt: excerpt || content.substring(0, 150) + '...',
    coverImage,
    category: category || undefined,
    tags: parsedTags,
    author: user._id,
    status: status || 'published',
  });

  const populatedBlog = await blogModel
    .findById(blog._id)
    .populate('author', 'name photoUrl')
    .populate('category', 'name slug');

  const response = new apiResponse(
    201,
    populatedBlog,
    'Blog created successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

// Get all published blogs (public)
export const getPublicBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const categoryId = req.query.category;

  let filter = { status: 'published' };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  if (categoryId) {
    filter.category = categoryId;
  }

  const [blogs, total] = await Promise.all([
    blogModel
      .find(filter)
      .populate('author', 'name photoUrl')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    blogModel.countDocuments(filter),
  ]);

  const response = new apiResponse(
    200,
    {
      posts: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter = {};

  // Non-admin can only see their own blogs or published blogs
  if (user.role !== 'admin') {
    filter.$or = [{ author: user._id }, { status: 'published' }];
  }

  const [blogs, total] = await Promise.all([
    blogModel
      .find(filter)
      .populate('author', 'name role photoUrl')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    blogModel.countDocuments(filter),
  ]);

  const response = new apiResponse(
    200,
    {
      posts: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await blogModel
    .findById(id)
    .populate('author', 'name role photoUrl')
    .populate('category', 'name slug')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'name photoUrl' },
    });

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  const response = new apiResponse(
    200,
    blog,
    'Blog fetched successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

// Get blog by slug (public)
export const getBlogBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const blog = await blogModel
    .findOne({ slug })
    .populate('author', 'name role photoUrl')
    .populate('category', 'name slug')
    .populate({
      path: 'comments',
      populate: { path: 'user', select: 'name photoUrl' },
    });

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  // Only show if published or user is author/admin
  if (blog.status !== 'published') {
    if (
      !req.user ||
      (req.user.role !== 'admin' &&
        blog.author._id.toString() !== req.user._id.toString())
    ) {
      throw new apiError(404, 'Blog not found');
    }
  }

  const response = new apiResponse(
    200,
    blog,
    'Blog fetched successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, category, tags, status } = req.body;
  const user = req.user;

  const blog = await blogModel.findById(id);

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  if (user.role !== 'admin' && blog.author.toString() !== user._id.toString()) {
    throw new apiError(403, 'You are not allowed to update this blog');
  }

  if (title) {
    blog.title = title;
    // Regenerate slug if title changes
    blog.slug = generateSlug(title);
  }
  if (content) blog.content = content;
  if (excerpt !== undefined) blog.excerpt = excerpt;
  if (category !== undefined) blog.category = category || undefined;
  if (status) blog.status = status;

  if (tags !== undefined) {
    blog.tags =
      typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : tags;
  }

  // If new image uploaded → delete old one from Cloudinary first
  if (req.file) {
    if (blog.coverImage) {
      await deleteFromCloudinary(blog.coverImage);
    }
    const fileUri = getDataUri(req.file);
    const upload = await cloudinary.uploader.upload(fileUri);
    blog.coverImage = upload.secure_url;
  }

  await blog.save();

  const populatedBlog = await blogModel
    .findById(blog._id)
    .populate('author', 'name photoUrl')
    .populate('category', 'name slug');

  const response = new apiResponse(
    200,
    populatedBlog,
    'Blog updated successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const blog = await blogModel.findById(id);

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  if (user.role !== 'admin' && blog.author.toString() !== user._id.toString()) {
    throw new apiError(403, 'You are not allowed to delete this blog');
  }

  // Cascade: image from Cloudinary + all comments + blog document
  await cascadeDeleteBlog(blog);

  const response = new apiResponse(
    200,
    null,
    'Blog deleted successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const getBlogByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  let filter = { author: userId };

  // If not the owner or admin, only show published
  if (
    !req.user ||
    (req.user.role !== 'admin' && req.user._id.toString() !== userId)
  ) {
    filter.status = 'published';
  }

  const [blogs, total] = await Promise.all([
    blogModel
      .find(filter)
      .populate('author', 'name role photoUrl')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    blogModel.countDocuments(filter),
  ]);

  const response = new apiResponse(
    200,
    {
      posts: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

// Get current user's blogs
export const getMyBlogs = asyncHandler(async (req, res) => {
  const user = req.user;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  let filter = { author: user._id };
  if (status) {
    filter.status = status;
  }

  const [blogs, total] = await Promise.all([
    blogModel
      .find(filter)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    blogModel.countDocuments(filter),
  ]);

  const response = new apiResponse(
    200,
    {
      posts: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
    'Your blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});
