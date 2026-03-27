# BookShare - Online Book Rental Service

A full-stack web application that allows people in the same locality to share and rent books among themselves.

## Features

- User registration and authentication with JWT
- Location-based book search (find books nearby using geolocation)
- Add and manage books
- Rent books at ₹40/week with security deposit
- Razorpay payment integration
- In-person book exchange with dual confirmation system
- Transaction tracking for both renters and owners
- Wishlist functionality with availability notifications

## Tech Stack

**Frontend:**
- React
- TailwindCSS
- React Router DOM
- Axios
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt.js for password hashing
- Razorpay payment gateway

## Project Structure

```
book-rental-service/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Book.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── bookRoutes.js
│   │   └── transactionRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── helpers.js
│   ├── .env
│   ├── server.js
│   ├── seed.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── BookCard.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Register.js
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── SearchBooks.js
    │   │   ├── RentBook.js
    │   │   ├── MyRentals.js
    │   │   └── MyBooks.js
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── helpers.js
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payment gateway)

### Step 1: Install MongoDB

**On macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Verify MongoDB is running:**
```bash
mongosh
# Should connect to MongoDB shell
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd /Users/parth/book-rental-service/backend

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit the .env file with your credentials:
# - MongoDB URI (default: mongodb://localhost:27017/book-rental-db)
# - JWT Secret (change this!)
# - Razorpay credentials (get from https://dashboard.razorpay.com/)

# Seed the database with sample data
npm run seed

# Expected output:
# ✅ MongoDB Connected
# 🗑️  Clearing existing data...
# 👥 Creating users...
# ✅ Created 4 users
# 📚 Creating books...
# ✅ Created 10 books
# ✅ Database seeded successfully!
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory
cd /Users/parth/book-rental-service/frontend

# Install dependencies (already done)
npm install

# Configure environment variables
# Edit the .env file:
# - REACT_APP_API_URL (default: http://localhost:5000/api)
# - REACT_APP_RAZORPAY_KEY_ID (your Razorpay key)
```

### Step 4: Get Razorpay Credentials

1. Sign up at https://dashboard.razorpay.com/
2. Go to Settings → API Keys
3. Generate Test/Live Keys
4. Copy the Key ID and Secret
5. Update both `.env` files:
   - Backend: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Frontend: `REACT_APP_RAZORPAY_KEY_ID`

## Running the Application

### Option 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd /Users/parth/book-rental-service/backend
npm run dev

# Expected output:
# [nodemon] starting `node server.js`
# 🚀 Server is running on port 5000
# 📍 API available at http://localhost:5000
# ✅ MongoDB Connected: localhost
```

**Terminal 2 - Frontend:**
```bash
cd /Users/parth/book-rental-service/frontend
npm start

# Expected output:
# Compiled successfully!
# webpack compiled with 1 warning
#
# Local:            http://localhost:3000
# On Your Network:  http://192.168.x.x:3000
```

### Option 2: Quick Start Script

Create a start script in the root directory:

```bash
# In /Users/parth/book-rental-service/
# Create start.sh

#!/bin/bash
echo "Starting MongoDB..."
brew services start mongodb-community

echo "Starting Backend..."
cd backend
npm run dev &

echo "Starting Frontend..."
cd ../frontend
npm start
```

## Testing the Application

### Sample Login Credentials (After Seeding)

```
Email: amit@example.com
Password: password123

Email: priya@example.com
Password: password123

Email: rahul@example.com
Password: password123

Email: sneha@example.com
Password: password123
```

### Testing Flow

1. **Register a New User**
   - Go to http://localhost:3000
   - Click "Register"
   - Fill in details
   - Click "Capture My Location" (allow browser location access)
   - Submit registration

2. **Add a Book**
   - Login and go to Dashboard
   - Click "Add Book"
   - Fill in book details
   - Submit

3. **Search for Books**
   - Go to "Search Books"
   - Toggle "Show Nearby Books Only" to find books near you
   - Adjust max distance slider

4. **Rent a Book**
   - Click "Rent" on any available book
   - Select rental duration
   - Click "Pay & Rent Book"
   - Complete Razorpay payment (use test cards in test mode)

5. **Confirm Exchange**
   - Go to "My Rentals"
   - Both renter and owner must click "Confirm Book Exchange"
   - Once both confirm, rental starts

6. **Return Book**
   - Go to "My Rentals"
   - Both parties click "Confirm Book Return"
   - Transaction completes, book becomes available again

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/update-location` - Update user location (protected)

### Books
- `GET /api/books` - Get all books (with filters)
- `GET /api/books/nearby` - Get nearby books (protected)
- `GET /api/books/:id` - Get single book
- `POST /api/books` - Add new book (protected)
- `PUT /api/books/:id` - Update book (protected, owner only)
- `DELETE /api/books/:id` - Delete book (protected, owner only)
- `POST /api/books/:id/wishlist` - Add to wishlist (protected)
- `DELETE /api/books/:id/wishlist` - Remove from wishlist (protected)

### Transactions
- `POST /api/transactions/create-order` - Create Razorpay order (protected)
- `POST /api/transactions/verify-payment` - Verify payment (protected)
- `POST /api/transactions/:id/confirm-exchange` - Confirm book exchange (protected)
- `POST /api/transactions/:id/confirm-return` - Confirm book return (protected)
- `GET /api/transactions/my-rentals` - Get user's rentals (protected)
- `GET /api/transactions/my-books-rented` - Get books rented out (protected)
- `GET /api/transactions/:id` - Get single transaction (protected)

## Payment Flow

1. User clicks "Rent Book"
2. Backend creates Razorpay order
3. Frontend opens Razorpay checkout
4. User completes payment
5. Backend verifies payment signature
6. Transaction status updated to "payment_completed"
7. Users meet in person to exchange book
8. Both confirm exchange → rental starts
9. After rental period, both confirm return
10. Book becomes available, deposit refunded

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/book-rental-db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
SECURITY_DEPOSIT_PERCENTAGE=20
WEEKLY_RENT=40
NEARBY_RADIUS_KM=10
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
brew services list
brew services start mongodb-community

# Or start manually
mongod --config /usr/local/etc/mongod.conf
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Location Permission Denied
- Make sure to allow location access in browser
- For Safari: Preferences → Websites → Location → Allow
- For Chrome: Settings → Privacy → Site Settings → Location → Allow

### Razorpay Test Mode
Use these test cards in test mode:
- Card Number: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

## Production Deployment

### Backend (Render/Railway)
1. Push code to GitHub
2. Create new Web Service
3. Connect repository
4. Add environment variables
5. Deploy

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Import project
3. Add environment variables
4. Deploy

### MongoDB Atlas
1. Create cluster at https://cloud.mongodb.com
2. Get connection string
3. Update MONGODB_URI in backend

## Security Notes

- Change JWT_SECRET in production
- Use HTTPS in production
- Never commit .env files
- Use environment variables for all secrets
- Enable CORS only for trusted origins
- Use Razorpay webhooks for production

## Features to Add (Future)

- Email notifications
- Book ratings and reviews
- Advanced search filters
- User profiles with reputation system
- Chat between users
- Book condition photos upload
- Late return penalties
- Referral system

## License

MIT

## Support

For issues and questions, please create an issue in the repository.
