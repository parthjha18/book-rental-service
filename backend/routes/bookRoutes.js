const express = require('express');
const Book = require('../models/Book');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure Multer for local book cover uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/book-covers/');
  },
  filename(req, file, cb) {
    cb(null, `book-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  }
});

// @route   POST /api/books
// @desc    Add a new book
// @access  Private
router.post('/', protect, upload.single('coverImage'), async (req, res) => {
  try {
    const { title, author, description, price, genre, condition } = req.body;
    
    let coverImage = '';
    if (req.file) {
      coverImage = `${req.protocol}://${req.get('host')}/uploads/book-covers/${req.file.filename}`;
    }

    const book = await Book.create({
      title,
      author,
      description,
      price: Number(price),
      genre,
      condition,
      coverImage,
      owner: req.user._id,
    });

    // Add book to user's booksOwned array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { booksOwned: book._id }
    });

    res.status(201).json({
      success: true,
      data: book,
      message: 'Book added successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/books
// @desc    Get all books with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, genre, available, sort } = req.query;
    let query = {};

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by genre
    if (genre) {
      query.genre = genre;
    }

    // Filter by availability
    if (available === 'true') {
      query.isAvailable = true;
    }

    let booksQuery = Book.find(query).populate('owner', 'name email phone location');

    // Sorting
    if (sort === 'newest') {
      booksQuery = booksQuery.sort({ createdAt: -1 });
    } else if (sort === 'price_low') {
      booksQuery = booksQuery.sort({ price: 1 });
    } else if (sort === 'price_high') {
      booksQuery = booksQuery.sort({ price: -1 });
    }

    const books = await booksQuery;

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/books/nearby
// @desc    Get books near user's location
// @access  Private
router.get('/nearby', protect, async (req, res) => {
  try {
    const { maxDistance = 10000 } = req.query; // default 10km in meters

    const userLocation = req.user.location.coordinates;

    // Find all books
    const allBooks = await Book.find({ isAvailable: true }).populate('owner');

    // Filter books by owner location
    const nearbyBooks = [];

    for (const book of allBooks) {
      // Skip books owned by the user
      if (book.owner._id.toString() === req.user._id.toString()) {
        continue;
      }

      // Calculate distance
      const ownerLocation = book.owner.location.coordinates;
      const distance = calculateDistanceInMeters(
        userLocation[1], userLocation[0],
        ownerLocation[1], ownerLocation[0]
      );

      if (distance <= maxDistance) {
        nearbyBooks.push({
          ...book.toObject(),
          distance: Math.round(distance / 1000 * 10) / 10, // Convert to km with 1 decimal
        });
      }
    }

    // Sort by distance
    nearbyBooks.sort((a, b) => a.distance - b.distance);

    res.json({
      success: true,
      count: nearbyBooks.length,
      data: nearbyBooks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// Helper function to calculate distance
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// @route   GET /api/books/user/my-books
// @desc    Get books owned by current user
// @access  Private
router.get('/user/my-books', protect, async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id })
      .populate('currentRenter', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate('owner', 'name email phone location')
      .populate('currentRenter', 'name email phone');

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update book
// @access  Private (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user is the owner
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: book,
      message: 'Book updated successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete book
// @access  Private (owner only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user is the owner
    if (book.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    // Check if book is currently rented
    if (!book.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete a book that is currently rented'
      });
    }

    await book.deleteOne();

    // Remove from user's booksOwned
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { booksOwned: req.params.id }
    });

    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   POST /api/books/:id/wishlist
// @desc    Add book to wishlist
// @access  Private
router.post('/:id/wishlist', protect, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Add to user's wishlist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishlist: req.params.id } },
      { new: true }
    );

    // Add user to book's waitlist
    await Book.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { usersWaitlisted: req.user._id } }
    );

    res.json({
      success: true,
      message: 'Book added to wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

// @route   DELETE /api/books/:id/wishlist
// @desc    Remove book from wishlist
// @access  Private
router.delete('/:id/wishlist', protect, async (req, res) => {
  try {
    // Remove from user's wishlist
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: req.params.id } },
      { new: true }
    );

    // Remove user from book's waitlist
    await Book.findByIdAndUpdate(
      req.params.id,
      { $pull: { usersWaitlisted: req.user._id } }
    );

    res.json({
      success: true,
      message: 'Book removed from wishlist',
      data: user.wishlist
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

module.exports = router;
