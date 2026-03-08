import apiError from '../errors/apiError.js';
import apiResponse from '../errors/apiResponse.js';
import asyncHandler from '../errors/asyncHandler.js';
import blogModel from '../models/blogModel.js';
import commentModel from '../models/commentModel.js';

export const createComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const commenterUserId = req.id;
  const { content, isSuper = false } = req.body;

  if (!content) {
    throw new apiError(400, 'Comment content is required');
  }

  // only superusers and admins can create super comments
  if (isSuper && req.user.role === 'user') {
    throw new apiError(403, 'You are not allowed to create super comments');
  }

  const blog = await blogModel.findById(postId);
  if (!blog) {
    throw new apiError(404, 'Blog post not found');
  }

  // normal users cannot comment on super blogs
  if (blog.isSuper && req.user.role === 'user') {
    throw new apiError(403, 'You are not allowed to comment on this blog');
  }

  const comment = await commentModel.create({
    content,
    isSuper,
    userId: commenterUserId,
    postId,
  });

  const populateSelect =
    req.user.role === 'user' ? 'name photoUrl' : 'name superName photoUrl';

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
  aaaa;
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

  // normal users can't see super comments
  if (role === 'user') {
    filter.isSuper = false;
  }

  const populateSelect =
    role === 'user' ? 'name photoUrl' : 'name superName photoUrl';

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
  if (role === 'user') {
    filter.isSuper = false;
  }

  const populateSelect =
    role === 'user' ? 'name photoUrl' : 'name superName photoUrl';

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
  if (role === 'user') {
    filter.isSuper = false;
  }

  const populateSelect =
    role === 'user' ? 'name photoUrl' : 'name superName photoUrl';

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
