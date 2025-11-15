const express = require('express');
const router = express.Router();
const controller = require('../controllers/book.controller');

// GET /api/books - Get all books (with search/filter)
router.get('/', controller.getAllBooks);

// POST /api/books - Create a new book
router.post('/', controller.createBook);

// GET /api/books/:id - Get a single book
router.get('/:id', controller.getBookById);

// PUT /api/books/:id - Update a book (can also use PATCH)
router.put('/:id', controller.updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', controller.deleteBook);

module.exports = router;
