import React from 'react';

// Props are passed from App.js
function BookList({ books, onStatusChange, onDelete }) {
  
  const handleStatusUpdate = (book, newStatus) => {
    onStatusChange(book._id, { status: newStatus });
  };

  if (books.length === 0) {
    return <p>No books in your library. Add one above!</p>;
  }

  return (
    <div className="book-list">
      <h3>Your Library</h3>
      {books.map((book) => (
        <div key={book._id} className="book-item">
          <h4>{book.title}</h4>
          <p>by {book.author}</p>
          <div className="status-controls">
            <span>Status: <strong>{book.status}</strong></span>
            <select 
              value={book.status} 
              onChange={(e) => handleStatusUpdate(book, e.target.value)}
            >
              <option value="To Read">To Read</option>
              <option value="Reading">Reading</option>
              <option value="Completed">Completed</option>
            </select>
            <button onClick={() => onDelete(book._id)} className="delete-btn">
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BookList;