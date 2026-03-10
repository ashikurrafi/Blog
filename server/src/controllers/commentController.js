import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import commentModel from '../models/commentModel.js';

// Fields to populate for user data
const populateSelect = 'name role photoUrl';

export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const commenterUserId = req.id;
  const { content } = req.body;

  if (!content) {
    throw new apiError(400, 'Comment content is required');
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
    select: populateSelect,
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

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw new apiError(404, 'Comment not found');
  }

  if (comment.userId.toString() !== userId.toString()) {
    throw new apiError(403, 'You are not allowed to update this comment');
  }

  comment.content = content;
  comment.editedAt = new Date();

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
  const role = req.user.role;

  const comment = await commentModel.findById(commentId);

  if (!comment) {
    throw new apiError(404, 'Comment not found');
  }

  // owner or admin can delete
  if (comment.userId.toString() !== userId.toString() && role !== 'admin') {
    throw new apiError(403, 'You are not allowed to delete this comment');
  }

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
  const role = req.user.role;

  let filter = { postId };

  const comments = await commentModel
    .find(filter)
    .populate({ path: 'userId', select: populateSelect })
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    comments,
    comments.length ? 'Comments fetched successfully' : 'No comments found',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getAllComment = asyncHandler(async (req, res) => {
  const role = req.user.role;

  let filter = {};

  const comments = await commentModel
    .find(filter)
    .populate({ path: 'userId', select: populateSelect })
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    comments,
    'All comments fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});

export const getAllCommentsOnMyBlogs = asyncHandler(async (req, res) => {
  const authorId = req.id;
  const role = req.user.role;

  const blogs = await blogModel.find({ author: authorId }).select('_id');
  const blogIds = blogs.map((blog) => blog._id);

  if (blogIds.length === 0) {
    return res
      .status(200)
      .json(new apiResponse(200, [], 'No comments found', true));
  }

  let filter = { postId: { $in: blogIds } };

  const comments = await commentModel
    .find(filter)
    .populate('userId', populateSelect)
    .sort({ createdAt: -1 });

  const response = new apiResponse(
    200,
    comments,
    'Comments on your blogs fetched successfully',
    true,
  );

  res.status(response.statusCode).json(response);
});
