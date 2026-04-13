import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/search',    label: 'Browse',    icon: '🔍' },
  { to: '/my-books',  label: 'My Books',  icon: '📚' },
  { to: '/rentals',   label: 'Rentals',   icon: '📋' },
];

const Navbar = () => {
  const { user, setUser, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen]   = useState(false);
  const [uploadingDP,   setUploadingDP]   = useState(false);
  const [scrolled,      setScrolled]      = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef  = useRef(null);

  /* Scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingDP(true);
    const formData = new FormData();
    formData.append('avatar', file);
    const toastId = toast.loading('Uploading...');
    try {
      const { data } = await API.post('/auth/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success) {
        toast.success('Profile picture updated!', { id: toastId });
        const updatedUser = { ...user, avatar: data.data.avatar };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed', { id: toastId });
    } finally {
      setUploadingDP(false);
    }
  };

  const isActive = (to) => location.pathname === to;

  return (
    <>
      <motion.nav
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/85 backdrop-blur-xl border-b border-white/8 shadow-[0_4px_24px_rgba(0,0,0,.6)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-base shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
                📚
              </div>
              <span className="text-[17px] font-bold tracking-tight">
                Book<span className="gradient-text">Share</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {user ? (
                <>
                  {user.role === 'admin' ? (
                    <Link
                      to="/admin"
                      className="px-4 py-2 text-sm font-semibold text-amber-400 hover:text-amber-300 hover:bg-amber-400/8 rounded-xl transition-all"
                    >
                      ⚡ Admin Panel
                    </Link>
                  ) : (
                    <>
                      {NAV_LINKS.map(({ to, label }) => (
                        <Link
                          key={to}
                          to={to}
                          className={`relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                            isActive(to)
                              ? 'text-white'
                              : 'text-zinc-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {label}
                          {isActive(to) && (
                            <motion.div
                              layoutId="nav-indicator"
                              className="absolute inset-0 rounded-xl bg-white/8 -z-10"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                        </Link>
                      ))}
                    </>
                  )}

                  {/* Avatar */}
                  <div ref={dropdownRef} className="relative ml-3">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center justify-center w-9 h-9 rounded-full ring-2 ring-white/10 hover:ring-orange-500/40 transition-all overflow-hidden bg-zinc-800 shadow-lg"
                    >
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-orange-400">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -8 }}
                          transition={{ duration: 0.15, ease: 'easeOut' }}
                          className="absolute right-0 mt-3 w-72 glass-strong rounded-2xl shadow-2xl shadow-black/60 p-5 flex flex-col gap-4 origin-top-right"
                        >
                          {/* Avatar + Name */}
                          <div className="flex items-center gap-3">
                            <div className="relative flex-shrink-0">
                              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-500/30">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-orange-500/20 flex items-center justify-center text-lg font-bold text-orange-400">
                                    {user.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              {/* Upload button */}
                              <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadingDP}
                                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-zinc-800 border border-zinc-700 rounded-full text-[10px] flex items-center justify-center hover:bg-zinc-700 transition-colors disabled:opacity-50"
                                title="Change photo"
                              >
                                📷
                              </button>
                              <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={handleFileChange} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-white text-sm leading-tight">{user.name}</p>
                              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 font-medium capitalize">
                                {user.role}
                              </span>
                            </div>
                          </div>

                          {/* Details */}
                          <div className="border-t border-white/6 pt-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2.5 text-sm text-zinc-300">
                              <span className="text-base">📍</span>
                              <div>
                                <p className="text-xs text-zinc-500">{user.location?.address}</p>
                                <p className="font-medium">{user.location?.city}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-zinc-300">
                              <span className="text-base">📞</span>
                              <p className="font-medium">{user.phone}</p>
                            </div>
                          </div>

                          <button
                            onClick={handleLogout}
                            className="w-full mt-1 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/8 border border-red-500/15 hover:bg-red-500/15 transition-all"
                          >
                            Sign Out
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="ml-1 px-5 py-2 text-sm font-semibold text-black bg-white rounded-full hover:bg-zinc-200 transition-all shadow-md hover:shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Toggle menu"
            >
              <motion.span animate={{ rotate: isMobileOpen ? 45 : 0, y: isMobileOpen ? 6 : 0 }} className="w-5 h-0.5 bg-white rounded-full block transition-all" />
              <motion.span animate={{ opacity: isMobileOpen ? 0 : 1 }} className="w-5 h-0.5 bg-white rounded-full block transition-all" />
              <motion.span animate={{ rotate: isMobileOpen ? -45 : 0, y: isMobileOpen ? -6 : 0 }} className="w-5 h-0.5 bg-white rounded-full block transition-all" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 md:hidden glass-strong border-b border-white/5 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col gap-2">
              {user ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 pb-4 mb-2 border-b border-white/5">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-lg font-bold text-orange-400">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>

                  {user.role === 'admin' ? (
                    <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-amber-400 hover:bg-amber-400/8 rounded-xl transition-all">
                      ⚡ Admin Panel
                    </Link>
                  ) : (
                    NAV_LINKS.map(({ to, label, icon }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                          isActive(to)
                            ? 'text-white bg-white/8'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span>{icon}</span> {label}
                      </Link>
                    ))
                  )}

                  <div className="border-t border-white/5 mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/8 rounded-xl transition-all"
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
                    Login
                  </Link>
                  <Link to="/register" className="mt-1 block text-center px-4 py-3 text-sm font-semibold text-black bg-white rounded-xl hover:bg-zinc-200 transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
