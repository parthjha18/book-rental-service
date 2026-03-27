import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span>Book<span className="text-orange-400">Share</span></span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-sm text-zinc-300 hover:text-white transition-colors">Dashboard</Link>
                    <Link to="/search" className="text-sm text-zinc-300 hover:text-white transition-colors">Search Books</Link>
                    <Link to="/my-books" className="text-sm text-zinc-300 hover:text-white transition-colors">My Books</Link>
                    <Link to="/rentals" className="text-sm text-zinc-300 hover:text-white transition-colors">My Rentals</Link>
                  </>
                )}
                <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
                  <span className="text-sm text-zinc-400">Hello, <span className="text-white font-medium">{user.name}</span></span>
                  <button
                    onClick={handleLogout}
                    className="text-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">Login</Link>
                <Link
                  to="/register"
                  className="text-sm bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
