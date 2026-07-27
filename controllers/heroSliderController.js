import HeroSlider from "../models/HeroSlider.js";
import asyncHandler from "../utils/asyncHandler.js";
import fs from "fs";
import path from "path";

export const createHeroSlide = asyncHandler(


  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Hero image is required.",
      });
    }

    // ==========================================================
    // AUTO ORDER
    // ==========================================================

    const lastHero = await HeroSlider.findOne()
      .sort({ order: -1 })
      .select("order");

    const nextOrder = lastHero ? lastHero.order + 1 : 1;

    const hero = await HeroSlider.create({
      title: req.body.title,

      subtitle: req.body.subtitle,

      image: `/uploads/hero/${req.file.filename}`,

      primaryButton: req.body.primaryButton
        ? JSON.parse(req.body.primaryButton)
        : undefined,

      secondaryButton: req.body.secondaryButton
        ? JSON.parse(req.body.secondaryButton)
        : undefined,

      order: nextOrder,

      isActive:
        req.body.isActive === "true",
    });

    res.status(201).json({
      success: true,
      message: "Hero slide created successfully.",
      data: hero,
    });
  }
);

export const getHeroSlides = asyncHandler(
  async (req, res) => {
    const slides = await HeroSlider.find().sort({
  order: 1,
});

    res.status(200).json({
      success: true,
      data: slides,
    });
  }
);

export const updateHeroSlide = asyncHandler(async (req, res) => {
  const hero = await HeroSlider.findById(req.params.id);

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found.",
    });
  }

  if (req.file) {
    const oldImage = path.join(
      process.cwd(),
      "public",
      hero.image
    );

    if (fs.existsSync(oldImage)) {
      fs.unlinkSync(oldImage);
    }

    hero.image = `/uploads/hero/${req.file.filename}`;
  }

  hero.title = req.body.title ?? hero.title;
  hero.subtitle = req.body.subtitle ?? hero.subtitle;

  if (req.body.primaryButton) {
    hero.primaryButton = JSON.parse(req.body.primaryButton);
  }

  if (req.body.secondaryButton) {
    hero.secondaryButton = JSON.parse(req.body.secondaryButton);
  }

  hero.order = req.body.order ?? hero.order;

  if (req.body.isActive !== undefined) {
    hero.isActive = req.body.isActive;
  }

  await hero.save();

  res.json({
    success: true,
    message: "Hero slide updated successfully.",
    data: hero,
  });
});
export const deleteHeroSlide = asyncHandler(async (req, res) => {
  const hero = await HeroSlider.findById(req.params.id);

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found.",
    });
  }

  const imagePath = path.join(
    process.cwd(),
    "public",
    hero.image
  );

  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  await hero.deleteOne();

  // =========================================
  // REORDER REMAINING HEROES
  // =========================================

  const heroes = await HeroSlider.find().sort({
    order: 1,
  });

  for (let i = 0; i < heroes.length; i++) {
    heroes[i].order = i + 1;
    await heroes[i].save();
  }

  res.json({
    success: true,
    message: "Hero deleted successfully.",
  });
});

/* ==========================================================
   MOVE UP
========================================================== */

export const moveHeroUp = asyncHandler(async (req, res) => {
  const hero = await HeroSlider.findById(req.params.id);

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found.",
    });
  }

  const upperHero = await HeroSlider.findOne({
    order: { $lt: hero.order },
  }).sort({ order: -1 });

  if (!upperHero) {
    return res.status(400).json({
      success: false,
      message: "Already at first position.",
    });
  }

  const currentOrder = hero.order;

  hero.order = upperHero.order;
  upperHero.order = currentOrder;

  await hero.save();
  await upperHero.save();

  res.json({
    success: true,
    message: "Hero moved up successfully.",
  });
});

/* ==========================================================
   MOVE DOWN
========================================================== */

export const moveHeroDown = asyncHandler(async (req, res) => {
  const hero = await HeroSlider.findById(req.params.id);

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found.",
    });
  }

  const lowerHero = await HeroSlider.findOne({
    order: { $gt: hero.order },
  }).sort({ order: 1 });

  if (!lowerHero) {
    return res.status(400).json({
      success: false,
      message: "Already at last position.",
    });
  }

  const currentOrder = hero.order;

  hero.order = lowerHero.order;
  lowerHero.order = currentOrder;

  await hero.save();
  await lowerHero.save();

  res.json({
    success: true,
    message: "Hero moved down successfully.",
  });
});

/* ==========================================================
   TOGGLE STATUS
========================================================== */

export const toggleHeroStatus = asyncHandler(async (req, res) => {
  const hero = await HeroSlider.findById(req.params.id);

  if (!hero) {
    return res.status(404).json({
      success: false,
      message: "Hero slide not found.",
    });
  }

  hero.isActive = !hero.isActive;

  await hero.save();

  res.json({
    success: true,
    message: `Hero ${hero.isActive ? "activated" : "deactivated"
      } successfully.`,
    data: hero,
  });
});