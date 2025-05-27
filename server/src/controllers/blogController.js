import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import blogModel from "../models/blogModel.js";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const imagePath = req.file.filename;
  console.log(imagePath);
  const createdBlog = await blogModel.create({
    title,
    content,
    image: imagePath,
  });

  if (!createdBlog) {
    throw new apiError(500, "Failed to create blog");
  }

  await createdBlog.save();

  res.json(
    new apiResponse(
      200,
      { blog: createdBlog },
      "Blog created successfully",
      true
    )
  );
});
