const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    uploadedBy: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    imageUrl: { type: String, required: true },
    bookUrl: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema);
