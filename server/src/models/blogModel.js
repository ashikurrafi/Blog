import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isSuper: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  { timestamps: true },
);

blogSchema.index({ isSuper: 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
