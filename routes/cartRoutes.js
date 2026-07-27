import express from "express";

import {
    getCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
} from "../controllers/cartController.js";

import {
    authenticate,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ==========================================================
   ALL ROUTES REQUIRE LOGIN
========================================================== */

router.use(authenticate);

/* ==========================================================
   CART
========================================================== */

router.get("/", getCart);

router.post("/", addToCart);

router.delete("/clear", clearCart);

router.patch("/:itemId", updateQuantity);

router.delete("/:itemId", removeItem);

export default router;