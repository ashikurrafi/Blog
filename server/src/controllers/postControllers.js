const { v4: uuidv4 } = require("uuid");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { fileRemover } = require("../utils/fileRemover");
const uploadPicture = require("../middlewares/uploadPictureMiddleware");

const createPost = async (req, res, next) => {
  try {
    const post = new Post({
      title: "Sample title",
      caption: "Sample caption",
      slug: uuidv4(),
      body: {
        type: "doc",
        content: [],
      },
      photo: "",
      user: req.user._id,
    });
    const createdPost = await post.save();
    return res.json(createdPost);
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug });
    if (!post) {
      const error = new Error("Post was not found");
      next(error);
      return;
    }
    const upload = uploadPicture.single("postPicture");
    const handleUpdatePostData = async (data) => {
      const { title, caption, slug, body, tags, categories } = JSON.parse(data);
      post.title = title || post.title;
      post.caption = caption || post.caption;
      post.slug = slug || post.slug;
      post.body = body || post.body;
      post.tags = tags || post.tags;
      post.categories = categories || post.categories;
      const updatedPost = await post.save();
      return res.json(updatedPost);
    };
    upload(req, res, async function (err) {
      if (err) {
        const error = new Error(
          "An unknown error occurred when uploading " + err.message
        );
        next(error);
      } else {
        // every thing went well
        if (req.file) {
          const filename = post.photo;
          if (filename) {
            fileRemover(filename);
          }
          post.photo = req.file.filename;
          handleUpdatePostData(req.body.document);
        } else {
          const filename = post.photo;
          post.photo = "";
          fileRemover(filename);
          handleUpdatePostData(req.body.document);
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndDelete({ slug: req.params.slug });
    if (!post) {
      const error = new Error("Post not found");
      return next(error);
    }
    await Comment.deleteMany({ post: post._id });
    return res.json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate([
      {
        path: "user",
        select: ["avatar", "name"],
      },
      {
        path: "comments",
        match: {
          check: true,
          parent: null,
        },
        populate: [
          {
            path: "user",
            select: ["avatar", "name"],
          },
          {
            path: "replies",
            match: {
              check: true,
            },
          },
        ],
      },
    ]);
    if (!post) {
      const error = new Error("Post not found");
      return next(error);
    }
    return res.json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  updatePost,
  deletePost,
  getPost,
};
