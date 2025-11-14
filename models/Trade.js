// /models/Trade.js
const mongoose = require('mongoose');

const TradeSchema = new mongoose.Schema({
  // This links the trade to a specific user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  tradeType: {
    type: String,
    enum: ['BUY', 'SELL'], // Only allows these two values
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trade', TradeSchema);
