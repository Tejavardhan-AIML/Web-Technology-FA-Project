const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['To Read', 'Reading', 'Completed'],
    default: 'To Read'
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;