import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import blogModel from "../models/blogModel.js";
import commentModel from "../models/commentModel.js";

export const createComment = asyncHandler(async (req, res) => {
  const { blogId, userId, comment } = req.body;
  if (!blogId || !userId || !comment) {
    throw new apiError(400, "Post ID, User ID, and comment are required");
  }

  const newComment = new commentModel({
    blogId,
    userId,
    comments: comment,
  });

  await newComment.save();

  // Find the blog post and add the comment to it
  const blogPost = await blogModel.findById(blogId);
  if (!blogPost) {
    throw new apiError(404, "Blog post not found");
  }

  blogPost.comments.push(newComment._id);
  await blogPost.save();

  res.json(
    new apiResponse(
      200,
      { Comment: newComment },
      "Comment created successfully"
    )
  );
});

export const editComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;

  console.log(commentId);
  const { comments } = req.body;

  console.log(comments);

  if (!comments) {
    throw new apiError(400, "Comment content is required to edit");
  }

  const existingComment = await commentModel.findById(commentId);
  if (!existingComment) {
    throw new apiError(404, "Comment not found");
  }

  existingComment.comments = comments;

  await existingComment.save();

  res.json(
    new apiResponse(
      200,
      { Comment: existingComment },
      "Comment updated successfully"
    )
  );
});

export const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;

  if (!commentId) {
    throw new apiError(400, "Comment ID is required");
  }

  const comment = await commentModel.findByIdAndDelete(commentId);

  res.json(
    new apiResponse(200, { Comment: comment }, "Comment deleted successfully")
  );
});
