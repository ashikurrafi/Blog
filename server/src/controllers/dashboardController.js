import fs from "fs";
import path from "path";
import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import blogModel from "../models/blogModel.js";
import userModel from "../models/userModel.js";

export const getAllData = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  const blogs = await blogModel.find();

  if (!users) {
    throw new apiError(400, "No users found");
  }

  if (!blogs) {
    throw new apiError(400, "No blogs found");
  }

  res.json(
    new apiResponse({
      status: "success",
      data: {
        blogs: blogs,
        users: users,
      },
      message: "All data fetched successfully",
    })
  );
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await blogModel.find();
  if (!blogs) {
    throw new apiError(400, "No blogs found");
  }

  res.json(
    new apiResponse({
      status: "success",
      data: { blogs: blogs },
      message: "All blogs fetched successfully",
    })
  );
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find();
  if (!users) {
    throw new apiError(400, "No users found");
  }

  res.json(
    new apiResponse({
      status: "success",
      data: { users: users },
      message: "All users fetched successfully",
    })
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

export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  const existingUser = await userModel.findById(userId);

  if (existingUser.role === "admin" || existingUser.role !== "user") {
    throw new apiError(403, "You cannot delete an admin");
  }

  if (!existingUser) {
    throw new apiError(404, "User not found");
  }

  if (existingUser.image) {
    const imagePath = path.join("src/public/images", existingUser.image);
    console.log(imagePath);
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      }
    });
  }

  await userModel.findByIdAndDelete(userId);

  res.json(
    new apiResponse({
      status: "success",
      data: existingUser,
      message: "User deleted successfully",
    })
  );
});

export const getAllComments = asyncHandler(async (req, res) => {
  res.json(
    new apiResponse({
      status: "success",
      data: [],
      message: "All comments fetched successfully",
    })
  );
});

export const deleteComment = asyncHandler(async (req, res) => {
  res.json(
    new apiResponse({
      status: "success",
      data: null,
      message: "Comment deleted successfully",
    })
  );
});
