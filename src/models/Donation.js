// Donation model
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    donorName: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
