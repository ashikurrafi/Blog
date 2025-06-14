import fs from "fs";
import path from "path";
import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import blogModel from "../models/blogModel.js";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category, isPublished } = req.body;

  const imagePath = req.file?.filename;

  if (!title || !content || !req.file || !category) {
    throw new apiError(400, "Title, content, image, category are required");
  }

  const createdBlog = await blogModel.create({
    title,
    content,
    image: imagePath,
    author: req.user._id,
    category,
    isPublished,
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
  const { category, isPublished, author, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};

  if (category) filter.category = category;
  if (isPublished !== undefined) filter.isPublished = isPublished === "true";
  if (author) filter.author = author;

  // Calculate pagination
  const skip = (page - 1) * limit;

  const blogs = await blogModel
    .find(filter)
    .populate("author", "name email image")
    .populate({
      path: "comments",
      populate: {
        path: "userId",
        select: "name email image",
      },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const totalBlogs = await blogModel.countDocuments(filter);

  if (!blogs || blogs.length === 0) {
    throw new apiError(404, "No blogs found");
  }

  res.json(
    new apiResponse(
      200,
      {
        Allblogs: blogs,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalBlogs / limit),
          totalBlogs,
          hasNextPage: page * limit < totalBlogs,
          hasPrevPage: page > 1,
        },
      },
      "Blogs retrieved successfully",
      true
    )
  );
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
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

  if (category) {
    updatedBlog.category = category;
  }

  if (req.file) {
    const oldImage = updatedBlog.image;

    if (oldImage) {
      const imagePath = path.join("src/public/images", oldImage);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting old image:", err);
        }
      });
    }

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

export const getBlogById = asyncHandler(async (req, res) => {
  const blogId = req.params.id;

  if (!blogId) {
    throw new apiError(400, "Blog ID is required");
  }

  const blog = await blogModel.findById(blogId).populate({
    path: "comments",
    populate: {
      path: "userId",
    },
  });

  if (!blog) {
    throw new apiError(404, "Blog not found");
  }

  res.json(
    new apiResponse(200, { Blog: blog }, "Blog retrieved successfully", true)
  );
});

export const getBlogsByAuthor = asyncHandler(async (req, res) => {
  const authorId = req.params.id;
  if (!authorId) {
    throw new apiError(400, "Author ID is required");
  }
  const blogs = await blogModel
    .find({ author: authorId })
    .sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new apiError(404, "No blogs found for this author");
  }

  res.json(
    new apiResponse(200, { Blogs: blogs }, "Blogs retrieved successfully", true)
  );
});
