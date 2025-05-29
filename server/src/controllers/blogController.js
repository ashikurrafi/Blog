import fs from "fs";
import path from "path";
import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import blogModel from "../models/blogModel.js";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const imagePath = req.file.filename;

  if (!title || !content || !req.file) {
    throw new apiError(400, "Title, content, and image are required");
  }

  const createdBlog = await blogModel.create({
    title,
    content,
    image: imagePath,
  });

  if (!createdBlog) {
    throw new apiError(500, "Failed to create blog");
  }

  await createdBlog.save();

  res.json(
    new apiResponse(
      200,
      { Blog: createdBlog },
      "Blog created successfully",
      true
    )
  );
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  if (!blogId) {
    throw new apiError(400, "Blog ID is required");
  }

  const blog = await blogModel.findById(blogId);
  if (!blog) {
    throw new apiError(404, "Blog not found");
  }

  if (blog.image) {
    const imagePath = path.join("src/public/images", blog.image);
    console.log(imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      }
    });
  }

  await blogModel.findByIdAndDelete(blogId);

  res.json(
    new apiResponse(
      200,
      { DeletedBlog: blog },
      "Blog deleted successfully",
      true
    )
  );
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.find().sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new apiError(404, "No blogs found");
  }

  res.json(
    new apiResponse(
      200,
      { Allblogs: blogs },
      "Blogs retrieved successfully",
      true
    )
  );
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  const blogId = req.params.id;

  const updatedBlog = await blogModel.findById(blogId);

  if (!updatedBlog) {
    throw new apiError(404, "Blog not found");
  }

  if (title) {
    updatedBlog.title = title;
  }

  if (content) {
    updatedBlog.content = content;
  }

  if (req.file) {
    updatedBlog.image = req.file.filename;
  }

  await updatedBlog.save();

  res.json(
    new apiResponse(
      200,
      { UpdatedBlog: updatedBlog },
      "Blog updated successfully",
      true
    )
  );
});
