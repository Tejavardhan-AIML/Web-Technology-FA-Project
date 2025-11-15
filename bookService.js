import axios from 'axios';

// Define the base URL for your backend.
// This assumes your backend is running on port 5000.
const API_URL = 'http://localhost:5000/api/books';

export const getBooks = (params = {}) => {
  // Pass search or filter params to the backend
  return axios.get(API_URL, { params });
};

export const getBook = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const addBook = (bookData) => {
  return axios.post(API_URL, bookData);
};

export const updateBook = (id, bookData) => {
  return axios.put(`${API_URL}/${id}`, bookData);
};

export const deleteBook = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};