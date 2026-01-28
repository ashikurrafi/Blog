import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import commentModel from '../models/commentModel.js';

export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const commenterUserId = req.id;
  const { content } = req.body;

  if (!content) {
    return res
      .status(400)
      .json({ message: 'Comment content is required', success: false });
  }

  const blog = await blogModel.findById(postId);
  if (!blog) {
    throw new apiError(404, 'Blog post not found');
  }

  const comment = await commentModel.create({
    content,
    userId: commenterUserId,
    postId,
  });

  await comment.populate({
    path: 'userId',
    select: 'name photoUrl',
  });

  blog.comments.push(comment._id);
  await blog.save();

  const response = new apiResponse(
    201,
    comment,
    'Comment created successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { content } = req.body;
  const { commentId } = req.params;

  console.log('comment ID', commentId);
  console.log('user ID', userId);
  console.log('content', content);

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw new apiError(404, 'Comment not found');
  }

  console.log(comment);

  if (comment.userId.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not allowed to update this comment');
  }
  comment.content = content;
  comment.editedAt = new Date(); // Optional: Add this field to schema

  await comment.save();

  const response = new apiResponse(
    200,
    comment,
    'Comment updated successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.id;

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw new apiError(404, 'Comment not found');
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not allowed to delete this comment');
  }

  // Remove comment from blog.comments
  await blogModel.findByIdAndUpdate(comment.postId, {
    $pull: { comments: commentId },
  });

  await commentModel.findByIdAndDelete(commentId);

  const response = new apiResponse(
    200,
    null,
    'Comment deleted successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getBlogComments = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const comments = await commentModel
    .find({ postId })
    .populate({ path: 'userId', select: 'firstName lastName photoUrl' })
    .sort({ createdAt: -1 });

  if (!comments || comments.length === 0) {
    throw new apiError(404, 'No comments found');
  }

  const response = new apiResponse(
    200,
    comments,
    'Comments fetched successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const getAllComment = asyncHandler(async (req, res) => {
  const comments = await commentModel
    .find()
    .populate({ path: 'userId', select: 'name photoUrl' })
    .sort({ createdAt: -1 });

  if (!comments || comments.length === 0) {
    throw new apiError(404, 'No comments found');
  }

  const response = new apiResponse(
    200,
    comments,
    'All Comments fetched successfully',
    true,
  );
  res.status(response.statusCode).json(response);
});

export const getAllCommentsOnMyBlogs = asyncHandler(async (req, res) => {
  const authorId = req.id;

  const blogs = await blogModel.find({ author: authorId }).select('_id');

  const blogIds = blogs.map((blog) => blog._id);

  if (blogIds.length === 0) {
    const response = new apiResponse(200, [], 'No comments found', true);
    return res.status(response.statusCode).json(response);
  }

  const comments = await commentModel
    .find({ postId: { $in: blogIds } })
    .populate('userId', 'firstName lastName photoUrl')
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    comments,
    'Comments on your blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});
