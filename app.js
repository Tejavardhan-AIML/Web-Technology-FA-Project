require('dotenv').config();
// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Database Connection ---
// !! Replace with your MongoDB connection string !!
const MONGO_URI = 'mongodb://localhost:27017/WebTechFA'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- Middleware ---
// To parse JSON data from requests (like from fetch)
app.use(express.json()); 
// To parse data from traditional HTML forms
app.use(express.urlencoded({ extended: true })); 
// To serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public'))); 

// --- API Routes ---
// Tell the server to use your route files
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trades', require('./routes/trades'));
app.use('/api/marketdata', require('./routes/marketdata'));

// --- Root Route ---
// By default, send users to the login/signup page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});