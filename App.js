import React, { useState, useEffect } from 'react';
import * as bookService from './api/bookService'; // Import all functions
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import './App.css'; // We'll add some basic styles

function App() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Initial load: Fetch all books
  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch books (can be filtered by search term)
  const fetchBooks = async (search = '') => {
    try {
      const response = await bookService.getBooks({ search: search });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(searchTerm);
  };

  // Handle adding a new book
  const handleAddBook = async (bookData) => {
    try {
      const response = await bookService.addBook(bookData);
      setBooks([...books, response.data]); // Add new book to the state
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  // Handle updating a book's status
  const handleStatusChange = async (id, updatedData) => {
    try {
      const response = await bookService.updateBook(id, updatedData);
      // Update the book in the local state
      setBooks(books.map(book =>
        book._id === id ? response.data : book
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle deleting a book
  const handleDeleteBook = async (id) => {
    try {
      await bookService.deleteBook(id);
      // Remove the book from the local state
      setBooks(books.filter(book => book._id !== id));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Personal Book Tracker</h1>
      </header>
      <main>
        <BookForm onBookAdded={handleAddBook} />
        
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input 
            type="text"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit">Search</button>
        </form>

        <BookList
          books={books}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteBook}
        />
      </main>
    </div>
  );
}

export default App;