// /routes/marketdata.js
const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = process.env.ALPHA_VANTAGE_KEY;

/**
 * @route   GET /api/marketdata/:symbol
 * @desc    Get daily time series data for a game company stock
 * @access  Public
 */
router.get('/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

  try {
    const response = await axios.get(url);

    // Check if Alpha Vantage API returned an error (e.g., invalid symbol)
    if (response.data['Error Message']) {
      return res.status(404).json({ msg: 'Invalid symbol or API error.' });
    }

    // Send the data back to our frontend
    res.json(response.data);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;