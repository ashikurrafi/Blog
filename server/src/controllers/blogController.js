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
      { blog: createdBlog },
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

  await blogModel.findByIdAndDelete(blogId);

  res.json(new apiResponse(200, null, "Blog deleted successfully", true));
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.find().sort({ createdAt: -1 });

  if (!blogs || blogs.length === 0) {
    throw new apiError(404, "No blogs found");
  }

  res.json(
    new apiResponse(200, { blogs }, "Blogs retrieved successfully", true)
  );
});
