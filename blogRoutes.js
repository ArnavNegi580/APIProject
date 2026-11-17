const express = require("express");
const Blog = require("../models/Blog");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE BLOG
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content, category } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            author: req.user.id
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create blog"
        });
    }
});

// GET ALL BLOGS
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name")
            .sort({ createdAt: -1 });

        res.json(blogs);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch blogs"
        });
    }
});

module.exports = router;