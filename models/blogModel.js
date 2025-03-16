// models/blogModel.js
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }], // Add this line
});

module.exports = mongoose.model('Blog', blogSchema);