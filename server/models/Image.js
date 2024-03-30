const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userTitle: { type: String, required: true },
  favroutie: { type: Boolean, default: false } });

module.exports = mongoose.model('Image', imageSchema);
