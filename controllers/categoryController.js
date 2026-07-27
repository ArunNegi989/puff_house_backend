import fs from "fs";
import path from "path";
import slugify from "slugify";
import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

/* ==========================================================
   CREATE CATEGORY
========================================================== */

export const createCategory = asyncHandler(async (req, res) => {

  const {
    name,
    description,
    status,
  } = req.body;

  const slug = slugify(name, {
    lower: true,
    strict: true,
  });

  const exists = await Category.findOne({
    $or: [
      {
        name,
      },
      {
        slug,
      },
    ],
  });

  if (exists) {
    return res.status(400).json({
      success: false,
      message: "Category already exists.",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Category image is required.",
    });
  }
const lastCategory = await Category
  .findOne()
  .sort({ order: -1 });

const nextOrder = lastCategory
  ? lastCategory.order + 1
  : 1;
  const image = `/uploads/categories/${req.file.filename}`;

  const category = await Category.create({
    name,
    slug,
    description,
    image,
   order: nextOrder,
    status,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully.",
    category,
  });
});

/* ==========================================================
   GET ALL CATEGORIES
========================================================== */
export const getCategories = asyncHandler(async (req, res) => {

  const {
    page = 1,
    limit = 10,
    search,
    status,
  } = req.query;

  const query = {};

  if (search) {

    query.name = {
      $regex: search,
      $options: "i",
    };

  }

  if (status === "true") {

    query.status = true;

  }

  if (status === "false") {

    query.status = false;

  }

  const total = await Category.countDocuments(query);

  const categories = await Category.find(query)
    .sort({
      order: 1,
      createdAt: -1,
    })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const categoriesWithCount = await Promise.all(

    categories.map(async (category) => {

      const productCount = await Product.countDocuments({

        category: category.slug.toLowerCase(),

        status: true,

      });

      return {

        ...category.toObject(),

        productCount,

      };

    })

  );

  res.json({

    success: true,

    total,

    page: Number(page),

    pages: Math.ceil(total / Number(limit)),

    categories: categoriesWithCount,

  });

});

/* ==========================================================
   GET CATEGORY
========================================================== */

export const getCategory = asyncHandler(async (req, res) => {

  const category = await Category.findOne({
    slug: req.params.slug,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  res.json({
    success: true,
    category,
  });
});

/* ==========================================================
   UPDATE CATEGORY
========================================================== */

export const updateCategory = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  if (req.body.name) {

    const slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });

    const exists = await Category.findOne({
      slug,
      _id: {
        $ne: category._id,
      },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Category already exists.",
      });
    }

    req.body.slug = slug;
  }

  if (req.file) {

    if (category.image) {

      try {

        const oldImage = path.join(
          process.cwd(),
          "public",
          category.image.replace(/^\/+/, "")
        );

        if (fs.existsSync(oldImage)) {
          fs.unlinkSync(oldImage);
        }

      } catch (error) {

        console.error(
          "Old category image delete failed:",
          error.message
        );

      }

    }

    req.body.image =
      `/uploads/categories/${req.file.filename}`;

  }

  const updated = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    success: true,
    message: "Category updated successfully.",
    category: updated,
  });

});

/* ==========================================================
   DELETE CATEGORY
========================================================== */

export const deleteCategory = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  if (category.image) {

    try {

      const imagePath = path.join(
        process.cwd(),
        "public",
        category.image.replace(/^\/+/, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

    } catch (error) {

      console.error(
        "Category image delete failed:",
        error.message
      );

    }

  }

  await category.deleteOne();

  res.json({
    success: true,
    message: "Category deleted successfully.",
  });

});

/* ==========================================================
   TOGGLE CATEGORY STATUS
========================================================== */

export const toggleCategoryStatus = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  category.status = !category.status;

  await category.save();

  res.json({
    success: true,
    message: "Category status updated successfully.",
    category,
  });

});

/* ==========================================================
   MOVE CATEGORY UP
========================================================== */

export const moveCategoryUp = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  const previousCategory = await Category.findOne({
    order: { $lt: category.order },
  }).sort({ order: -1 });

  if (!previousCategory) {
    return res.status(400).json({
      success: false,
      message: "Category is already at the top.",
    });
  }

  const tempOrder = category.order;

  category.order = previousCategory.order;
  previousCategory.order = tempOrder;

  await category.save();
  await previousCategory.save();

  res.json({
    success: true,
    message: "Category moved up successfully.",
  });

});

/* ==========================================================
   MOVE CATEGORY DOWN
========================================================== */

export const moveCategoryDown = asyncHandler(async (req, res) => {

  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found.",
    });
  }

  const nextCategory = await Category.findOne({
    order: { $gt: category.order },
  }).sort({ order: 1 });

  if (!nextCategory) {
    return res.status(400).json({
      success: false,
      message: "Category is already at the bottom.",
    });
  }

  const tempOrder = category.order;

  category.order = nextCategory.order;
  nextCategory.order = tempOrder;

  await category.save();
  await nextCategory.save();

  res.json({
    success: true,
    message: "Category moved down successfully.",
  });

});