import express from "express";
import authRoutes from "./authRoutes.js";
import contactRoutes from "./contactRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import profileRoutes from "./profileRoutes.js";
import heroSliderRoutes from "./heroSliderRoutes.js";
import addressRoutes from "./addressRoutes.js";
import blogRoutes from "./blogRoutes.js";
import productRoutes from "./productRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import wishlistRoutes from "./wishlistRoutes.js";
import cartRoutes from "./cartRoutes.js";
import topBarRoutes from "./topBarRoutes.js";
import faqRoutes from "./faqRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/contact", contactRoutes);
router.use("/notifications", notificationRoutes);
router.use("/profile", profileRoutes);
router.use("/hero", heroSliderRoutes);
router.use("/address", addressRoutes);
router.use("/blogs", blogRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/cart", cartRoutes);
router.use("/topbar", topBarRoutes);
router.use("/faqs", faqRoutes);

export default router;