const express = require('express');
const router = express.Router();
const Book = require('../models/book');

// Crear un libro
router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener todos los libros
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un libro por ISBN
router.get('/:isbn', async (req, res) => {
    try {
        const book = await Book.findOne({ isbn: req.params.isbn });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar un libro
router.put('/:isbn', async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate(
            { isbn: req.params.isbn },
            req.body,
            { new: true }
        );
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar un libro
router.delete('/:isbn', async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ isbn: req.params.isbn });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;