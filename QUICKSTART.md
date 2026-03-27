# Quick Start Guide - BookShare

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running
- ✅ Razorpay account (for payments)

## 5-Minute Setup

### 1. Start MongoDB (if not running)

```bash
# On macOS
brew services start mongodb-community

# Verify it's running
mongosh
# Type 'exit' to quit
```

### 2. Configure Environment Variables

**Backend (.env):**
```bash
cd /Users/parth/book-rental-service/backend

# The .env file is already created. Update these values:
# - Change JWT_SECRET to a random string
# - Add your Razorpay Key ID and Secret
```

**Frontend (.env):**
```bash
cd /Users/parth/book-rental-service/frontend

# The .env file is already created. Update:
# - Add your Razorpay Key ID
```

### 3. Seed the Database

```bash
cd /Users/parth/book-rental-service/backend
npm run seed
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
🗑️  Clearing existing data...
👥 Creating users...
✅ Created 4 users
📚 Creating books...
✅ Created 10 books
✅ Database seeded successfully!

📋 Sample Login Credentials:
----------------------------
Email: amit@example.com
Password: password123
----------------------------
Email: priya@example.com
Password: password123
----------------------------
...
```

### 4. Start the Backend

```bash
# In the same terminal or new terminal
cd /Users/parth/book-rental-service/backend
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
🚀 Server is running on port 5000
📍 API available at http://localhost:5000
✅ MongoDB Connected: localhost
```

### 5. Start the Frontend

Open a NEW terminal:

```bash
cd /Users/parth/book-rental-service/frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

### 6. Open the Application

Your browser should automatically open http://localhost:3000

If not, manually navigate to: **http://localhost:3000**

## First-Time Usage

### Option 1: Use Sample Accounts

Login with any of these:
- **Email:** amit@example.com | **Password:** password123
- **Email:** priya@example.com | **Password:** password123

### Option 2: Create New Account

1. Click "Register"
2. Fill in your details
3. **Important:** Click "Capture My Location" button
4. Allow browser location access
5. Complete registration

## Testing the Full Flow

### As a Book Owner:

1. **Login** with amit@example.com / password123
2. Go to **Dashboard**
3. Click **"Add Book"**
4. Fill in book details and submit
5. Go to **"My Books"** to see your collection

### As a Book Renter:

1. **Login** with priya@example.com / password123
2. Go to **"Search Books"**
3. Check **"Show Nearby Books Only"**
4. Click **"Rent"** on a book
5. Select rental weeks (e.g., 2 weeks)
6. Click **"Pay & Rent Book"**

### For Payment Testing:

Use Razorpay Test Mode credentials:
- **Card:** 4111 1111 1111 1111
- **CVV:** Any 3 digits
- **Expiry:** Any future date
- **Name:** Any name

### Complete the Exchange:

1. After payment, go to **"My Rentals"**
2. **Renter** clicks "Confirm Book Exchange"
3. **Owner** (amit) also needs to confirm
4. Login as amit@example.com
5. Go to **"My Rentals"** → **"Books I Lent Out"** tab
6. Click "Confirm Book Exchange"
7. ✅ Rental is now active!

## Common Commands

### Backend
```bash
cd /Users/parth/book-rental-service/backend

npm run dev      # Start development server
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
cd /Users/parth/book-rental-service/frontend

npm start        # Start development server
npm run build    # Build for production
```

### Database
```bash
mongosh                                    # Connect to MongoDB
use book-rental-db                        # Switch to database
db.users.find()                           # View all users
db.books.find()                           # View all books
db.transactions.find()                    # View all transactions
```

## Troubleshooting

### "MongoDB connection failed"
```bash
# Check if MongoDB is running
brew services list

# If not running, start it
brew services start mongodb-community
```

### "Port 5000 already in use"
```bash
# Find and kill process
lsof -ti:5000 | xargs kill -9

# Then restart backend
npm run dev
```

### "Location permission denied"
- Click the lock icon in browser address bar
- Allow location access
- Refresh the page

### "Razorpay is not defined"
- Make sure you've added RAZORPAY_KEY_ID to frontend/.env
- Restart the frontend server

## Next Steps

1. ✅ Add more books from Dashboard
2. ✅ Test location-based search
3. ✅ Try the complete rental flow
4. ✅ Test return confirmation process
5. ✅ Add books to wishlist

## Getting Razorpay Keys (Free)

1. Go to https://dashboard.razorpay.com/signup
2. Sign up with your email
3. Navigate to: Settings → API Keys
4. Click "Generate Test Keys"
5. Copy **Key ID** and **Key Secret**
6. Update both .env files

**For Testing:** You can use test mode without KYC verification!

## Project Files Checklist

- ✅ Backend folder with all routes and models
- ✅ Frontend folder with React components
- ✅ MongoDB schemas for User, Book, Transaction
- ✅ JWT authentication implemented
- ✅ Razorpay payment integration
- ✅ Location-based search functionality
- ✅ Seeding script with sample data
- ✅ Complete README documentation

## Need Help?

Check the main README.md for:
- Complete API documentation
- Detailed project structure
- Security best practices
- Deployment instructions

---

**You're all set! Happy coding! 📚**
