import express from "express";

import upload from "../middleware/upload.js";

import {
  createHeroSlide,
  getHeroSlides,
  updateHeroSlide,
  deleteHeroSlide,
  moveHeroUp,
  moveHeroDown,
  toggleHeroStatus,
} from "../controllers/heroSliderController.js";

import { heroValidation } from "../validators/heroValidator.js";

const router = express.Router();

router.get("/", getHeroSlides);

router.post(
  "/",
  upload.single("image"),
  heroValidation,
  createHeroSlide
);

router.put(
  "/:id",
  upload.single("image"),
  heroValidation,
  updateHeroSlide
);
router.patch("/:id/move-up", moveHeroUp);

router.patch("/:id/move-down", moveHeroDown);

router.patch("/:id/status", toggleHeroStatus);

router.delete("/:id", deleteHeroSlide);

export default router;