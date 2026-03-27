const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true,
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a book price'],
    min: 0,
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'Good',
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x450?text=Book+Cover',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  currentRenter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  rentalHistory: [{
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    rentedAt: Date,
    returnedAt: Date,
  }],
  usersWaitlisted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for text search
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

module.exports = mongoose.model('Book', bookSchema);
