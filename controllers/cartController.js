import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

import asyncHandler from "../utils/asyncHandler.js";

/* ==========================================================
   GET CART
========================================================== */

export const getCart = asyncHandler(async (req, res) => {

    let cart = await Cart.findOne({
        user: req.user._id,
    }).populate({
        path: "items.product",
        match: {
            status: true,
        },
    });

    /* --------------------------------------------
       CREATE CART IF NOT EXISTS
    -------------------------------------------- */

    if (!cart) {

        cart = await Cart.create({
            user: req.user._id,
            items: [],
        });

        return res.status(200).json({
            success: true,
            cart,
        });

    }

    /* --------------------------------------------
       REMOVE INVALID / DELETED PRODUCTS
    -------------------------------------------- */

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
        (item) => item.product
    );

    if (cart.items.length !== originalLength) {
        await cart.save();
    }

    /* --------------------------------------------
       RESPONSE
    -------------------------------------------- */

    res.status(200).json({

        success: true,

        cart,

    });

});

/* ==========================================================
   ADD TO CART
========================================================== */

export const addToCart = asyncHandler(async (req, res) => {

    const {
        productId,
        quantity = 1,
    } = req.body;

    /* --------------------------------------------
       VALIDATE PRODUCT ID
    -------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(productId)) {

        return res.status(400).json({
            success: false,
            message: "Invalid product id.",
        });

    }

    /* --------------------------------------------
       VALIDATE QUANTITY
    -------------------------------------------- */

    const qty = Number(quantity);

    if (
        !Number.isInteger(qty) ||
        qty < 1
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid quantity.",
        });

    }

    /* --------------------------------------------
       FIND PRODUCT
    -------------------------------------------- */

    const product = await Product.findOne({
        _id: productId,
        status: true,
    });

    if (!product) {

        return res.status(404).json({
            success: false,
            message: "Product not found.",
        });

    }

    /* --------------------------------------------
       STOCK CHECK
    -------------------------------------------- */

    if (
        !product.inStock ||
        product.stock <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Product is out of stock.",
        });

    }

    /* --------------------------------------------
       REQUESTED QUANTITY
    -------------------------------------------- */

    if (qty > product.stock) {

        return res.status(400).json({
            success: false,
            message: `Only ${product.stock} item(s) available.`,
        });

    }

    /* --------------------------------------------
       FIND / CREATE CART
    -------------------------------------------- */

    let cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {

        cart = await Cart.create({
            user: req.user._id,
            items: [],
        });

    }

    /* --------------------------------------------
       CHECK EXISTING ITEM
    -------------------------------------------- */

    const existingItem = cart.items.find(
        (item) =>
            item.product.toString() === productId
    );

    if (existingItem) {

        const newQuantity =
            existingItem.quantity + qty;

        if (newQuantity > product.stock) {

            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} item(s) available.`,
            });

        }

        existingItem.quantity = newQuantity;

        /*
        Optional:

        Refresh snapshots if product details changed.
        */

        existingItem.priceSnapshot =
            product.price;

        existingItem.productName =
            product.name;

        existingItem.imageSnapshot =
            product.images?.[0] || "";

    } else {

        cart.items.push({

            product: product._id,

            quantity: qty,

            priceSnapshot: product.price,

            productName: product.name,

            imageSnapshot:
                product.images?.[0] || "",

            addedAt: new Date(),

        });

    }

    /* --------------------------------------------
       SAVE
    -------------------------------------------- */

    await cart.save();

    await cart.populate({
        path: "items.product",
        match: {
            status: true,
        },
    });

    /* --------------------------------------------
       RESPONSE
    -------------------------------------------- */

    res.status(200).json({

        success: true,

        message:
            existingItem
                ? "Cart updated successfully."
                : "Product added to cart.",

        cart,

    });

});
/* ==========================================================
   UPDATE QUANTITY
========================================================== */

export const updateQuantity = asyncHandler(async (req, res) => {

    const { itemId } = req.params;

    const qty = Number(req.body.quantity);

    /* --------------------------------------------
       VALIDATE ITEM ID
    -------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(itemId)) {

        return res.status(400).json({
            success: false,
            message: "Invalid cart item id.",
        });

    }

    /* --------------------------------------------
       VALIDATE QUANTITY
    -------------------------------------------- */

    if (
        !Number.isInteger(qty) ||
        qty < 1
    ) {

        return res.status(400).json({
            success: false,
            message: "Invalid quantity.",
        });

    }

    /* --------------------------------------------
       FIND CART
    -------------------------------------------- */

    const cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {

        return res.status(404).json({
            success: false,
            message: "Cart not found.",
        });

    }

    /* --------------------------------------------
       FIND ITEM
    -------------------------------------------- */

    const item = cart.items.id(itemId);

    if (!item) {

        return res.status(404).json({
            success: false,
            message: "Cart item not found.",
        });

    }

    /* --------------------------------------------
       FIND PRODUCT
    -------------------------------------------- */

    const product = await Product.findOne({
        _id: item.product,
        status: true,
    });

    if (!product) {

        return res.status(404).json({
            success: false,
            message: "Product no longer exists.",
        });

    }

    /* --------------------------------------------
       STOCK CHECK
    -------------------------------------------- */

    if (
        !product.inStock ||
        product.stock <= 0
    ) {

        return res.status(400).json({
            success: false,
            message: "Product is out of stock.",
        });

    }

    if (qty > product.stock) {

        return res.status(400).json({
            success: false,
            message: `Only ${product.stock} item(s) available.`,
        });

    }

    /* --------------------------------------------
       UPDATE ITEM
    -------------------------------------------- */

    item.quantity = qty;

    /*
       Optional:
       Keep snapshots fresh.
    */

    item.priceSnapshot = product.price;

    item.productName = product.name;

    item.imageSnapshot =
        product.images?.[0] || "";

    /* --------------------------------------------
       SAVE
    -------------------------------------------- */

    await cart.save();

    await cart.populate({
        path: "items.product",
        match: {
            status: true,
        },
    });

    /* --------------------------------------------
       RESPONSE
    -------------------------------------------- */

    res.status(200).json({

        success: true,

        message: "Cart updated successfully.",

        cart,

    });

});

/* ==========================================================
   REMOVE ITEM
========================================================== */

export const removeItem = asyncHandler(async (req, res) => {

    const { itemId } = req.params;

    /* --------------------------------------------
       VALIDATE ITEM ID
    -------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(itemId)) {

        return res.status(400).json({
            success: false,
            message: "Invalid cart item id.",
        });

    }

    /* --------------------------------------------
       FIND CART
    -------------------------------------------- */

    const cart = await Cart.findOne({
        user: req.user._id,
    });

    if (!cart) {

        return res.status(404).json({
            success: false,
            message: "Cart not found.",
        });

    }

    /* --------------------------------------------
       FIND ITEM
    -------------------------------------------- */

    const item = cart.items.id(itemId);

    if (!item) {

        return res.status(404).json({
            success: false,
            message: "Cart item not found.",
        });

    }

    /* --------------------------------------------
       REMOVE ITEM
    -------------------------------------------- */

    cart.items.pull(itemId);

    /* --------------------------------------------
       OPTIONAL:
       DELETE EMPTY CART
    -------------------------------------------- */

    if (cart.items.length === 0) {

        await Cart.deleteOne({
            _id: cart._id,
        });

        return res.status(200).json({

            success: true,

            message: "Item removed successfully.",

            cart: {
                items: [],
                totalItems: 0,
                subtotal: 0,
            },

        });

    }

    /* --------------------------------------------
       SAVE
    -------------------------------------------- */

    await cart.save();

    await cart.populate({
        path: "items.product",
        match: {
            status: true,
        },
    });

    /* --------------------------------------------
       RESPONSE
    -------------------------------------------- */

    res.status(200).json({

        success: true,

        message: "Item removed successfully.",

        cart,

    });

});

/* ==========================================================
   CLEAR CART
========================================================== */

export const clearCart = asyncHandler(async (req, res) => {

    /* --------------------------------------------
       FIND CART
    -------------------------------------------- */

    const cart = await Cart.findOne({
        user: req.user._id,
    });

    /* --------------------------------------------
       CART DOES NOT EXIST
    -------------------------------------------- */

    if (!cart) {

        return res.status(200).json({

            success: true,

            message: "Cart is already empty.",

            cart: {
                items: [],
                totalItems: 0,
                subtotal: 0,
            },

        });

    }

    /* --------------------------------------------
       DELETE CART DOCUMENT
    -------------------------------------------- */

    await Cart.deleteOne({
        _id: cart._id,
    });

    /* --------------------------------------------
       RESPONSE
    -------------------------------------------- */

    return res.status(200).json({

        success: true,

        message: "Cart cleared successfully.",

        cart: {
            items: [],
            totalItems: 0,
            subtotal: 0,
        },

    });

});