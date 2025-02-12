const { Schema, model } = require("mongoose");

const PostCategoriesSchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("PostCategories", PostCategoriesSchema);
