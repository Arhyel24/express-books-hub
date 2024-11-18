const express = require('express');
const Book = require('../models/book');
const router = express.Router();

// Get all books
// Get all books
router.get('/', async (req, res) => {
    const books = await Book.find().populate('uploadedBy', 'username'); // Populate the uploadedBy field with username
    res.render('books', { books });
});

// Create a new book
router.get('/new', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    res.render('newBook');
});

router.post('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    
    const { title, description, author, category, imageUrl, bookUrl } = req.body;
    const book = new Book({ 
        title, 
        description, 
        author, 
        category, 
        uploadedBy: req.session.user.userId, // Set uploadedBy to the current user's ID
        imageUrl, 
        bookUrl 
    });
    await book.save();
    //res.redirect('/books');
    return res.status(201).json({ success: true, message: 'Book added successfully!' });

});

// Edit a book
router.get('/:id/edit', async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render('editBook', { book });
});

router.post('/:id', async (req, res) => {
    const { title, description, author, category, imageUrl, bookUrl } = req.body;
    await Book.findByIdAndUpdate(req.params.id, { title, description, author, category, imageUrl, bookUrl });
    res.redirect('/books');
});

router.get('/:id/view', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('uploadedBy');
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.render('viewBook', { book, currentUserId: req.session.user.userId }); // Pass the current user ID
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Delete a book
router.post('/:id/delete', async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books');
});

module.exports = router;
