import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SearchBooks from './pages/SearchBooks';
import RentBook from './pages/RentBook';
import MyRentals from './pages/MyRentals';
import MyBooks from './pages/MyBooks';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App min-h-screen">
          <Navbar />
          <Toaster position="top-right" />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <SearchBooks />
                </PrivateRoute>
              }
            />

            <Route
              path="/rent/:id"
              element={
                <PrivateRoute>
                  <RentBook />
                </PrivateRoute>
              }
            />

            <Route
              path="/rentals"
              element={
                <PrivateRoute>
                  <MyRentals />
                </PrivateRoute>
              }
            />

            <Route
              path="/my-books"
              element={
                <PrivateRoute>
                  <MyBooks />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
