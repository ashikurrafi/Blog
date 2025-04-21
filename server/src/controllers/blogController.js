const asyncHandler = require("../error/asyncHandler");
const apiError = require("../error/apiError");
const apiResponse = require("../error/apiResponse");

const Blog = require("../models/blogModel");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new apiError(400, "Please provide title and description");
  }

  // Create a new blog instance
  const blog = new Blog({
    title,
    description,
  });

  try {
    await blog.save();
  } catch (error) {
    throw new apiError(500, error.message);
  }

  const response = new apiResponse(201, blog, "Blog Created Successfully.");
  res.json(response);
});

const updateBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!id) {
    throw new apiError(400, "Please provide blog ID");
  }

  // Ensure at least one field is provided for updating
  if (!title || !description) {
    throw new apiError(
      400,
      "Please provide either title or description to update"
    );
  }

  let updatedBlog;
  try {
    const update = {};

    if (title) {
      update.title = title;
    }

    if (description) {
      update.description = description;
    }

    updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updatedBlog) {
      throw new apiError(404, "Blog not found");
    }
  } catch (error) {
    throw new apiError(500, error.message);
  }

  const response = new apiResponse(
    200,
    updatedBlog,
    "Blog Updated Successfully."
  );
  res.json(response);
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new apiError(400, "Please provide blog ID");
  }

  let blog;
  try {
    blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
      throw new apiError(404, "Blog not found");
    }
  } catch (error) {
    throw new apiError(500, error.message);
  }

  const response = new apiResponse(200, null, "Blog Deleted Successfully.");
  res.json(response);
});

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
};
