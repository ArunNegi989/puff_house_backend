import express from "express";

import uploadCategory from "../middleware/uploadCategory.js";

import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  moveCategoryDown,
  moveCategoryUp,
} from "../controllers/categoryController.js";

import { categoryValidation } from "../validators/categoryValidator.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   PUBLIC
========================================================== */

router.get("/", getCategories);

router.get("/:slug", getCategory);

/* ==========================================================
   ADMIN
========================================================== */

router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadCategory.single("image"),
  categoryValidation,
  createCategory
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadCategory.single("image"),
  categoryValidation,
  updateCategory
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteCategory
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  toggleCategoryStatus
);


router.patch(
  "/:id/move-up",
  authenticate,
  authorize("admin"),
  moveCategoryUp
);

router.patch(
  "/:id/move-down",
  authenticate,
  authorize("admin"),
  moveCategoryDown
);

export default router;