// routes/blogRoutes.js
const express = require('express');
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Blog = require('../models/blogModel');
const Image = require('../models/imageModel');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('images'); // Populate the images field
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new blog with multiple images
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({ title, content });
        await newBlog.save();

        const images = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path);
            const newImage = new Image({
                url: result.secure_url,
                blogId: newBlog._id,
            });
            await newImage.save();
            images.push(newImage);
        }

        newBlog.images = images.map(img => img._id);
        await newBlog.save();

        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;