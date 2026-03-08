import blogModel from '../models/blogModel.js';
import commentModel from '../models/commentModel.js';
import userModel from '../models/userModel.js';
import {
  deleteFromCloudinary,
  deleteManyFromCloudinary,
} from './cloudinary.js';

/**
 * Delete a single blog and all its associated data
 * - Delete blog image from Cloudinary
 * - Delete all comments on the blog
 * - Delete the blog document
 */
export const cascadeDeleteBlog = async (blog) => {
  // 1. Delete blog image from Cloudinary
  if (blog.imageUrl) {
    await deleteFromCloudinary(blog.imageUrl);
  }

  // 2. Delete all comments on this blog
  await commentModel.deleteMany({ postId: blog._id });

  // 3. Delete the blog
  await blogModel.findByIdAndDelete(blog._id);
};

/**
 * Delete a user and ALL their associated data:
 * - All blogs authored by the user (+ their images + their comments)
 * - All comments the user made on OTHER people's blogs
 * - User's profile photo from Cloudinary
 * - The user document itself
 */
export const cascadeDeleteUser = async (userId) => {
  // ─── Step 1: Handle all blogs authored by this user ───
  const userBlogs = await blogModel.find({ author: userId });

  // Collect all blog image URLs for batch Cloudinary deletion
  const blogImageUrls = userBlogs.map((blog) => blog.imageUrl).filter(Boolean);

  // Collect all blog IDs
  const userBlogIds = userBlogs.map((blog) => blog._id);

  // Delete all images from Cloudinary
  if (blogImageUrls.length > 0) {
    await deleteManyFromCloudinary(blogImageUrls);
  }

  // Delete all comments ON the user's blogs (by anyone)
  if (userBlogIds.length > 0) {
    await commentModel.deleteMany({ postId: { $in: userBlogIds } });
  }

  // Delete all the user's blogs
  await blogModel.deleteMany({ author: userId });

  // ─── Step 2: Handle comments the user made on OTHER people's blogs ───
  const userCommentsOnOtherBlogs = await commentModel.find({ userId });

  if (userCommentsOnOtherBlogs.length > 0) {
    const commentIds = userCommentsOnOtherBlogs.map((c) => c._id);

    // Pull these comment references from other blogs' comments arrays
    await blogModel.updateMany(
      { comments: { $in: commentIds } },
      { $pull: { comments: { $in: commentIds } } },
    );

    // Delete the comment documents
    await commentModel.deleteMany({ userId });
  }

  // ─── Step 3: Delete user profile photo from Cloudinary ───
  const user = await userModel.findById(userId);
  if (user?.photoUrl) {
    await deleteFromCloudinary(user.photoUrl);
  }

  // ─── Step 4: Delete the user document ───
  await userModel.findByIdAndDelete(userId);

  return user;
};
