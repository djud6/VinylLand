const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  vinyl: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vinyl',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01
  },
  status: {
    type: String,
    enum: ['pending', 'rejected', 'accepted'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Offer', offerSchema);
