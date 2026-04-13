require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();


// ✅ CORS (FIXED)
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// ✅ Handle preflight requests (IMPORTANT)
// app.options('*', cors()); // Removed for Express 5 compatibility, app.use(cors()) handles it



// ✅ Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ✅ Log incoming requests (for debugging)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`, req.body);
  next();
});


// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);


// ✅ Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Book Rental Service API is running',
    version: '1.0.0'
  });
});


// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});


// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}`);
});