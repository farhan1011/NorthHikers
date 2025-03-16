// models/imageModel.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: { type: String, required: true },
    blogId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
});

module.exports = mongoose.model('Image', imageSchema);