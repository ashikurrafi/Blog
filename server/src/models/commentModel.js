import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isSuper: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    editedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

commentSchema.index({ postId: 1, isSuper: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
