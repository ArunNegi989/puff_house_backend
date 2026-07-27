import express from "express";

import uploadBlog from "../middleware/uploadBlog.js";

import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  getFeaturedBlog,
  getPublicBlogs
} from "../controllers/blogController.js";

import { blogValidation } from "../validators/blogValidator.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   PUBLIC
========================================================== */
router.get("/public", getPublicBlogs);
router.get("/", getBlogs);

router.get("/featured", getFeaturedBlog);

router.get("/:slug", getBlog);

/* ==========================================================
   ADMIN
========================================================== */

router.post(
  "/",
  authenticate,
  authorize("admin"),
  uploadBlog.single("image"),
  blogValidation,
  createBlog
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  uploadBlog.single("image"),
  blogValidation,
  updateBlog
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteBlog
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  toggleBlogStatus
);

export default router;