// /routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model

// --- REGISTRATION API ---
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // 2. Create new user instance
    user = new User({
      username,
      email,
      password
    });

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 4. Save user to MongoDB
    await user.save();
    
    // Send back a success message (or a token in a real app)
    res.status(201).json({ msg: 'User registered successfully!', userId: user.id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}); // <-- Make sure this closing bracket is here

// --- LOGIN API ---
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // We send a generic error for security
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. Login successful
    // Send back the user ID to be saved in localStorage
    res.status(200).json({ msg: 'Login successful', userId: user.id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}); // <-- Make sure this closing bracket is here

// --- THIS IS THE CRITICAL LINE ---
// Make sure this is at the very end of the file
module.exports = router;