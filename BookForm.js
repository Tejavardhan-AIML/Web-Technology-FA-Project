import React, { useState } from 'react';

// 'onBookAdded' is a prop function passed from App.js
function BookForm({ onBookAdded }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author) {
      alert('Please enter both title and author');
      return;
    }

    // This data will be passed to the function in App.js
    const newBookData = {
      title,
      author,
      status: 'To Read' // Default status
    };

    onBookAdded(newBookData); // Call the function from the parent

    // Clear the form fields
    setTitle('');
    setAuthor('');
  };

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h3>Add a New Book</h3>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Author:</label>
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}

export default BookForm;
