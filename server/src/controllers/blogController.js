import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from '../utils/dataUri.js';

export const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const user = req.user;

  if (!title || !description) {
    throw new apiError(400, 'Title and description are required');
  }

  const file = req.file;
  let imageUrl = '';

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    imageUrl = cloudResponse.secure_url;
  }

  const blog = await blogModel.create({
    title,
    description,
    imageUrl,
    author: user._id,
  });

  const response = new apiResponse(
    200,
    blog,
    'Blog created successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const blog = await blogModel.findById(id);

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  const file = req.file;

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    blog.imageUrl = cloudResponse.secure_url; // ✅ update the blog instance
  }

  if (title) {
    blog.title = title; // ✅ update the blog instance
  }

  if (description) {
    blog.description = description; // ✅ update the blog instance
  }

  await blog.save(); // ✅ save the updated blog instance

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

  const blog = await blogModel.findById(id);

  if (!blog) {
    throw new apiError(404, 'Blog not found');
  }

  await blogModel.findByIdAndDelete(id);

  const response = new apiResponse(
    200,
    null,
    'Blog deleted successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getBlogById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await blogModel.findById(id);

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

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.find().sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    blogs,
    'Blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getBlogByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const blogs = await blogModel
    .find({ author: userId })
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    blogs,
    'Blogs fetched successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});
