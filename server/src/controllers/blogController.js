import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import { cascadeDeleteBlog } from '../utils/cascadeDelete.js';
import cloudinary, { deleteFromCloudinary } from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;

  if (!title || !description) {
    throw new apiError(400, 'Title and description are required');
  }

  let imageUrl = '';
  if (req.file) {
    const fileUri = getDataUri(req.file);
    const upload = await cloudinary.uploader.upload(fileUri);
    imageUrl = upload.secure_url;
  }

  const blog = await blogModel.create({
    title,
    description,
    imageUrl,
    author: user._id,
  });

  const response = new apiResponse(
    201,
    blog,
    'Blog created successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const role = req.user.role;
  let filter = {};

  const authorSelect =
    role === 'user' ? 'name role photoUrl' : 'name role photoUrl';

  const blogs = await blogModel
    .find(filter)
    .populate('author', authorSelect)
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    blogs,
    'Blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const role = req.user.role;

  const authorSelect =
    role === 'user' ? 'name role photoUrl' : 'name role photoUrl';

  const blog = await blogModel.findById(id).populate('author', authorSelect);

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

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const user = req.user;

  const blog = await blogModel.findById(id);

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  if (user.role !== 'admin' && blog.author.toString() !== user._id.toString()) {
    throw new apiError(403, 'You are not allowed to update this blog');
  }

  if (title) blog.title = title;
  if (description) blog.description = description;

  // If new image uploaded → delete old one from Cloudinary first
  if (req.file) {
    if (blog.imageUrl) {
      await deleteFromCloudinary(blog.imageUrl);
    }
    const fileUri = getDataUri(req.file);
    const upload = await cloudinary.uploader.upload(fileUri);
    blog.imageUrl = upload.secure_url;
  }

  await blog.save();

  const response = new apiResponse(
    200,
    blog,
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
  const role = req.user.role;

  let filter = { author: userId };

  const authorSelect =
    role === 'user' ? 'name role photoUrl' : 'name role photoUrl';

  const blogs = await blogModel
    .find(filter)
    .populate('author', authorSelect)
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    blogs,
    'Blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});
