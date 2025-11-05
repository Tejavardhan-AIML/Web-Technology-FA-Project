// /routes/trades.js
const express = require('express');
const router = express.Router();
const Trade = require('../models/Trade'); // Import Trade model

// --- SAVE NEW TRADE API ---
// @route   POST /api/trades
router.post('/', async (req, res) => {
  // In a real app, you'd get userId from a secure token (JWT)
  // For this template, we'll pass it in the request body
  const { userId, symbol, quantity, price, tradeType } = req.body;

  try {
    const newTrade = new Trade({
      userId,
      symbol,
      quantity,
      price,
      tradeType
    });

    // Save the trade to MongoDB
    const trade = await newTrade.save();
    
    // Send the saved trade back to the frontend
    res.status(201).json(trade); 

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- GET ALL TRADES FOR A USER ---
// @route   GET /api/trades/:userId
router.get('/:userId', async (req, res) => {
  try {
    // Find all trades in MongoDB that match the userId
    const trades = await Trade.find({ userId: req.params.userId })
                              .sort({ timestamp: -1 }); // Show newest first
    
    if (!trades) {
      return res.status(404).json({ msg: 'No trades found for this user' });
    }

    res.json(trades); // Send the list of trades as JSON

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;