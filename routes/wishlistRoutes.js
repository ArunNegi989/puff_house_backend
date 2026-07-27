import express from "express";

import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from "../controllers/wishlistController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   ALL ROUTES REQUIRE LOGIN
========================================================== */

router.use(authenticate);

/* ==========================================================
   WISHLIST
========================================================== */

router.get("/", getWishlist);

router.post("/:productId", addToWishlist);

router.delete("/:productId", removeFromWishlist);

router.delete("/", clearWishlist);

export default router;