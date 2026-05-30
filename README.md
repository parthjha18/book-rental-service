# 📚 BookShare — Peer-to-Peer Book Rental Service

> A full-stack platform where book lovers can lend and rent books from people nearby, powered by geolocation, Razorpay payments, and a dual-confirmation rental lifecycle.

---

## 🛠 Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20 |
| Framework | Express 5 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Payments | Razorpay |
| Email | Nodemailer (Gmail SMTP) |
| File Uploads | Multer (local disk storage) |
| Validation | express-validator |
| Containerisation | Docker + Docker Compose |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 (Create React App) |
| Routing | React Router DOM v7 |
| Styling | Tailwind CSS v3 |
| Animations | Framer Motion |
| HTTP | Axios |
| Forms | react-hook-form |
| Toasts | react-hot-toast |

---

## ✨ Features

- **JWT Authentication** — secure register / login with token-based sessions
- **Email OTP Verification** — 6-digit OTP sent via Nodemailer on registration
- **Geolocation-Based Discovery** — find available books near you (Haversine distance, configurable radius)
- **Razorpay Payment Integration** — create orders, verify signatures server-side
- **Dual-Confirmation Rental Lifecycle** — both owner and renter must confirm exchange AND return; prevents disputes
- **Wishlist & Waitlist** — users can wishlist books; owners see how many people are waiting
- **Book Management** — add books with cover image upload, edit, delete (with renter-state guard)
- **Admin Dashboard** — platform stats (users, books, transactions, revenue) + user management
- **Input Validation** — express-validator on all mutating endpoints; 422 responses with per-field errors
- **Debounced Search** — 500 ms debounce on text search; genre/nearby/distance filters fire immediately
- **MVC Architecture** — controllers cleanly separated from route definitions
- **Docker Compose** — one-command local stack (MongoDB + backend + frontend)

---

## 🏗 Architecture

### Backend (MVC)
```
backend/
├── controllers/         # Business logic (authController, bookController, transactionController, adminController)
├── middleware/          # JWT protect/admin guards, express-validator validate()
├── models/              # Mongoose schemas — User, Book, Transaction, Otp
├── routes/              # Thin routers — attach middleware + controller handlers only
├── utils/               # generateToken, calculateRentalAmount, helpers
├── uploads/             # Multer disk storage (avatars + book covers)
└── server.js            # Express app bootstrap
```

### Frontend
```
frontend/src/
├── components/          # Reusable UI components (BookCard, Navbar, modals, skeletons…)
├── context/             # AuthContext — global auth state + login/register/logout helpers
├── pages/               # Route-level components (Home, Login, Register, SearchBooks, RentBook, Dashboard…)
├── services/            # Axios instance (api.js) — reads REACT_APP_API_URL
└── utils/               # getCurrentLocation, formatting helpers
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18, npm ≥ 9
- MongoDB (local or Atlas)
- (Optional) Razorpay test account, Gmail App Password

### 1 · Clone the repo
```bash
git clone https://github.com/your-username/book-rental-service.git
cd book-rental-service
```

### 2 · Backend — install & configure
```bash
cd backend
npm install
cp .env.example .env   # fill in all values (see Environment Variables below)
```

### 3 · Frontend — install & configure
```bash
cd ../frontend
npm install --legacy-peer-deps
# .env already exists — edit REACT_APP_API_URL if needed
```

### 4 · Seed the database (optional)
```bash
cd ../backend
npm run seed
```

### 5 · Run locally
```bash
# Terminal 1 — backend
cd backend && npm run dev

# Terminal 2 — frontend
cd frontend && npm start
```

### Or — Docker Compose (all-in-one)
```bash
docker-compose up --build
```
- Frontend → http://localhost:3000  
- Backend  → http://localhost:5001  
- MongoDB  → mongodb://localhost:27017/bookshare

---

## 🔌 API Endpoints

### Auth  `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/send-otp` | Public | Send 6-digit OTP to email |
| POST | `/register` | Public | Register user (validates name, email, password ≥6, phone, otp, coordinates) |
| POST | `/login` | Public | Login, returns JWT |
| GET | `/me` | 🔐 User | Get current user profile |
| PUT | `/update-location` | 🔐 User | Update GPS coordinates |
| POST | `/upload-avatar` | 🔐 User | Upload profile picture (multipart) |

### Books  `/api/books`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Public | List all books (search, genre, available, sort query params) |
| POST | `/` | 🔐 User | Create book listing (validates title, author, description, price, genre, condition) |
| GET | `/nearby` | 🔐 User | Books within `maxDistance` metres of user |
| GET | `/user/my-books` | 🔐 User | Caller's own book listings |
| GET | `/:id` | Public | Single book details |
| PUT | `/:id` | 🔐 Owner | Update book |
| DELETE | `/:id` | 🔐 Owner | Delete book (blocked if currently rented) |
| POST | `/:id/wishlist` | 🔐 User | Add to wishlist / waitlist |
| DELETE | `/:id/wishlist` | 🔐 User | Remove from wishlist / waitlist |

### Transactions  `/api/transactions`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/create-order` | 🔐 User | Create Razorpay order (validates bookId, rentalWeeks 1–52) |
| POST | `/verify-payment` | 🔐 User | Verify Razorpay signature & mark payment complete |
| POST | `/:id/confirm-exchange` | 🔐 Party | Owner or renter confirms book handover |
| POST | `/:id/confirm-return` | 🔐 Party | Owner or renter confirms book return |
| GET | `/my-rentals` | 🔐 User | Transactions where caller is renter |
| GET | `/my-books-rented` | 🔐 User | Transactions where caller is owner |
| GET | `/:id` | 🔐 Party | Single transaction (owner or renter only) |

### Admin  `/api/admin`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/dashboard` | 🔐 Admin | Platform stats (users, books, transactions, revenue) |
| GET | `/users` | 🔐 Admin | All users |
| DELETE | `/users/:id` | 🔐 Admin | Delete user |

---

## 📸 Screenshots

> _Add screenshots after deployment._

---

## 🔑 Environment Variables

### Backend  (`backend/.env`)
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/bookshare
JWT_SECRET=your_jwt_secret_here

# Razorpay (leave as "dummy" in dev to use mock orders)
RAZORPAY_KEY_ID=dummy
RAZORPAY_KEY_SECRET=dummy

# Email OTP (leave blank in dev — OTP is logged to console)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password

# Payment verification bypass — ONLY for dev, NEVER expose to client
# NODE_ENV=development
# SKIP_PAYMENT_VERIFY=true
```

### Frontend  (`frontend/.env`)
```env
REACT_APP_API_URL=http://localhost:5001/api
```

### Frontend production  (`frontend/.env.production`)
```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```
