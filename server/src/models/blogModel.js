import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published',
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

blogSchema.index({ slug: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ author: 1, createdAt: -1 });
blogSchema.index({ category: 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
