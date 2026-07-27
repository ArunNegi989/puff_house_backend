import mongoose from "mongoose";
import { validationResult } from "express-validator";

import Blog from "../models/Blog.js";
import fs from "fs";
import path from "path";
import asyncHandler from "../utils/asyncHandler.js";

/* ==========================================================
   Helpers
========================================================== */

const slugify = (text) =>
    text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

/* ==========================================================
   CREATE BLOG
========================================================== */

export const createBlog = asyncHandler(
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Featured image is required.",
            });
        }

        const {
            title,
            excerpt,
            content,
            category,
            author,
            readTime,
            isFeatured,
            isActive,
        } = req.body;

        let tags = [];

        if (req.body.tags) {
            tags =
                typeof req.body.tags === "string"
                    ? JSON.parse(req.body.tags)
                    : req.body.tags;
        }

        let slug = slugify(title);

        const exists = await Blog.findOne({ slug });

        if (exists) {
            slug = `${slug}-${Date.now()}`;
        }

        const blog = await Blog.create({
            title,
            slug,
            excerpt,
            content,
            category,
            tags,
            author:
                author?.trim() || "Puff House Team",
            readTime:
                readTime?.trim() || "5 min read",
            isFeatured:
                isFeatured === "true" ||
                isFeatured === true,
            isActive:
                isActive === undefined
                    ? true
                    : isActive === "true" ||
                    isActive === true,
            featuredImage: `/uploads/blogs/${req.file.filename}`,
        });

        res.status(201).json({
            success: true,
            message: "Blog created successfully.",
            data: blog,
        });
    }
);

/* ==========================================================
   GET BLOGS
========================================================== */

export const getBlogs = asyncHandler(
    async (req, res) => {
        const {
            search = "",
            category,
            featured,
            status,
            sort = "latest",
        } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                {
                    title: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    excerpt: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    category: {
                        $regex: search,
                        $options: "i",
                    },
                },
                {
                    tags: {
                        $regex: search,
                        $options: "i",
                    },
                },
            ];
        }

        if (category) {
            query.category = category;
        }

        if (featured !== undefined) {
            query.isFeatured =
                featured === "true";
        }

        if (status !== undefined) {
            query.isActive =
                status === "true";
        }

        let sortOption = {
            createdAt: -1,
        };

        switch (sort) {
            case "oldest":
                sortOption = {
                    createdAt: 1,
                };
                break;

            case "az":
                sortOption = {
                    title: 1,
                };
                break;

            case "za":
                sortOption = {
                    title: -1,
                };
                break;

            default:
                sortOption = {
                    publishedAt: -1,
                };
        }

        const blogs = await Blog.find(query)
            .sort(sortOption)
            .lean();

        res.json({
            success: true,
            count: blogs.length,
            data: blogs,
        });
    }
);

/* ==========================================================
   GET BLOG
========================================================== */

export const getBlog = asyncHandler(
    async (req, res) => {
        const { slug } = req.params;

        const blog = await Blog.findOne({
            slug,
            isActive: true,
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }

        await Blog.findByIdAndUpdate(blog._id, {
            $inc: {
                views: 1,
            },
        });

        const relatedBlogs =
            await Blog.find({
                _id: {
                    $ne: blog._id,
                },
                category: blog.category,
                isActive: true,
            })
                .limit(3)
                .select(
                    "title slug featuredImage category author readTime excerpt publishedAt"
                );

        res.json({
            success: true,
            data: blog,
            relatedBlogs,
        });
    }
);

/* ==========================================================
   UPDATE BLOG
========================================================== */

export const updateBlog =
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog id.",
            });
        }

        const blog =
            await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }

        const {
            title,
            excerpt,
            content,
            category,
            author,
            readTime,
            isFeatured,
            isActive,
        } = req.body;

        if (
            title &&
            title !== blog.title
        ) {
            let slug = slugify(title);

            const exists =
                await Blog.findOne({
                    slug,
                    _id: {
                        $ne: id,
                    },
                });

            if (exists) {
                slug = `${slug}-${Date.now()}`;
            }

            blog.slug = slug;
            blog.title = title;
        }

        if (excerpt)
            blog.excerpt = excerpt;

        if (content)
            blog.content = content;

        if (category)
            blog.category = category;

        if (author)
            blog.author = author;

        if (readTime)
            blog.readTime = readTime;

        if (
            req.body.tags !== undefined
        ) {
            blog.tags =
                typeof req.body.tags ===
                    "string"
                    ? JSON.parse(req.body.tags)
                    : req.body.tags;
        }

        if (
            isFeatured !== undefined
        ) {
            blog.isFeatured =
                isFeatured === "true" ||
                isFeatured === true;
        }

        if (
            isActive !== undefined
        ) {
            blog.isActive =
                isActive === "true" ||
                isActive === true;
        }

        if (req.file) {
            // Delete old image
            if (blog.featuredImage) {
                const oldImagePath = path.join(
                    process.cwd(),
                    "public",
                    blog.featuredImage.replace("/uploads", "uploads")
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            blog.featuredImage = `/uploads/blogs/${req.file.filename}`;
        }

        await blog.save();

        res.json({
            success: true,
            message:
                "Blog updated successfully.",
            data: blog,
        });
    });

/* ==========================================================
   DELETE BLOG
========================================================== */

export const deleteBlog =
    asyncHandler(async (req, res) => {
        const { id } = req.params;

        const blog =
            await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }
        if (blog.featuredImage) {
            const imagePath = path.join(
                process.cwd(),
                "public",
                blog.featuredImage.replace("/uploads", "uploads")
            );

            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        await blog.deleteOne();

        res.json({
            success: true,
            message:
                "Blog deleted successfully.",
        });
    });

/* ==========================================================
   TOGGLE STATUS
========================================================== */

export const toggleBlogStatus =
    asyncHandler(async (req, res) => {
        const blog =
            await Blog.findById(
                req.params.id
            );

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found.",
            });
        }

        blog.isActive =
            !blog.isActive;

        await blog.save();

        res.json({
            success: true,
            message:
                "Status updated successfully.",
            data: blog,
        });
    });

/* ==========================================================
   FEATURED BLOG
========================================================== */

export const getFeaturedBlog =
    asyncHandler(async (req, res) => {
        const blog =
            await Blog.findOne({
                isFeatured: true,
                isActive: true,
            }).sort({
                publishedAt: -1,
            });

        res.json({
            success: true,
            data: blog,
        });
    });

    export const getPublicBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({
    isActive: true,
  })
    .sort({ publishedAt: -1 })
    .lean();

  res.json({
    success: true,
    data: blogs,
  });
});