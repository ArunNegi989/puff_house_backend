import mongoose from "mongoose";

import Product from "../models/Product.js";
import User from "../models/User.js";

import asyncHandler from "../utils/asyncHandler.js";

/* ==========================================================
   GET WISHLIST
========================================================== */

export const getWishlist = asyncHandler(async (req, res) => {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    const total = user.wishlist.length;

    await user.populate({
        path: "wishlist",
        match: {
            status: true,
        },
        options: {
            sort: {
                createdAt: -1,
            },
            skip: (page - 1) * limit,
            limit,
        },
    });

    res.status(200).json({
        success: true,
        wishlist: user.wishlist,
        page,
        limit,
        total,
        hasMore: page * limit < total,
    });

});

/* ==========================================================
   ADD TO WISHLIST
========================================================== */

export const addToWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product id.",
        });
    }

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

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    const alreadyExists = user.wishlist.some(
        (id) => id.toString() === productId
    );

    if (alreadyExists) {
        return res.status(409).json({
            success: false,
            message: "Product already exists in wishlist.",
        });
    }

    user.wishlist.push(product._id);

    await user.save();

    await user.populate({
        path: "wishlist",
        match: {
            status: true,
        },
        options: {
            sort: {
                createdAt: -1,
            },
        },
    });

    res.status(200).json({
        success: true,
        message: "Product added to wishlist successfully.",
        total: user.wishlist.length,
        wishlist: user.wishlist,
    });

});

/* ==========================================================
   REMOVE FROM WISHLIST
========================================================== */

export const removeFromWishlist = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid product id.",
        });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    const exists = user.wishlist.some(
        (id) => id.toString() === productId
    );

    if (!exists) {
        return res.status(404).json({
            success: false,
            message: "Product not found in wishlist.",
        });
    }

    user.wishlist = user.wishlist.filter(
        (id) => id.toString() !== productId
    );

    await user.save();

    await user.populate({
        path: "wishlist",
        match: {
            status: true,
        },
        options: {
            sort: {
                createdAt: -1,
            },
        },
    });

    res.status(200).json({
        success: true,
        message: "Product removed from wishlist successfully.",
        total: user.wishlist.length,
        wishlist: user.wishlist,
    });

});

/* ==========================================================
   CLEAR WISHLIST
========================================================== */

export const clearWishlist = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found.",
        });
    }

    user.wishlist = [];

    await user.save();

    res.status(200).json({
        success: true,
        message: "Wishlist cleared successfully.",
        total: 0,
        wishlist: [],
    });

});