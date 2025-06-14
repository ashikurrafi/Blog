import apiError from "../error/apiError.js";
import apiResponse from "../error/apiResponse.js";
import asyncHandler from "../error/asyncHandler.js";
import categoryModel from "../models/categoryModel.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new apiError(400, "Category name is required");
  }
  const existingCategory = await categoryModel.findOne({ name });
  if (existingCategory) {
    throw new apiError(400, "Category already exists");
  }

  const newCategory = await categoryModel.create({ name });
  if (!newCategory) {
    throw new apiError(500, "Failed to create category");
  }
  await newCategory.save();

  res.json(
    new apiResponse(
      200,
      { Category: newCategory },
      "Category created successfully",
      true
    )
  );
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryModel.find().select("-__v");
  if (!categories || categories.length === 0) {
    throw new apiError(404, "No categories found");
  }
  res.json(
    new apiResponse(
      200,
      { Categories: categories },
      "Categories retrieved successfully",
      true
    )
  );
});

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  if (!categoryId) {
    throw new apiError(400, "Category ID is required");
  }
  if (!name) {
    throw new apiError(400, "Category name is required");
  }
  const category = await categoryModel.findById(categoryId).select("-__v");
  if (!category) {
    throw new apiError(404, "Category not found");
  }
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    categoryId,
    { name },
    { new: true }
  );
  if (!updatedCategory) {
    throw new apiError(500, "Failed to update category");
  }
  res.json(
    new apiResponse(
      200,
      { Category: updatedCategory },
      "Category updated successfully",
      true
    )
  );
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    throw new apiError(400, "Category ID is required");
  }
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    throw new apiError(404, "Category not found");
  }
  const deletedCategory = await categoryModel.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new apiError(500, "Failed to delete category");
  }
  res.json(
    new apiResponse(
      200,
      { Category: deletedCategory },
      "Category deleted successfully",
      true
    )
  );
});
