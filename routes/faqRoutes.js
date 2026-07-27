import express from "express";

import {
  getFAQs,
  getAdminFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  toggleFAQ,
  moveUp,
  moveDown,
  reindexFAQs,
} from "../controllers/faqController.js";

import {
  faqValidation,
  validate,
} from "../validators/faqValidator.js";

import {
  authenticate,
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* Public */

router.get("/", getFAQs);

/* Admin */

router.get(
  "/admin",
  authenticate,
  authorize("admin"),
  getAdminFAQs
);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  faqValidation,
  validate,
  createFAQ
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  faqValidation,
  validate,
  updateFAQ
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteFAQ
);

router.patch(
  "/:id/toggle",
  authenticate,
  authorize("admin"),
  toggleFAQ
);

router.patch(
  "/:id/up",
  authenticate,
  authorize("admin"),
  moveUp
);

router.patch(
  "/:id/down",
  authenticate,
  authorize("admin"),
  moveDown
);

router.patch(
  "/reindex",
  authenticate,
  authorize("admin"),
  reindexFAQs
);

export default router;