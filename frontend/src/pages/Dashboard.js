import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';

const GENRES = ['Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Self-Help', 'History', 'Biography', 'Fantasy', 'Thriller'];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const Dashboard = () => {
  useAuth();
  const [showAddBook, setShowAddBook] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', genre: '', condition: 'Good', coverImage: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await API.post('/books', formData);
      if (data.success) {
        toast.success(data.message);
        setFormData({ title: '', author: '', description: '', price: '', genre: '', condition: 'Good', coverImage: '' });
        setShowAddBook(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    } finally {
      setSubmitting(false);
    }
  };

  const labelCls = "block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest";
  const inputCls = "input-premium";

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-10 max-w-4xl">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 mt-1 text-sm">Manage your book collection and earn from sharing</p>
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
          >
            {[
              { icon: '📚', label: 'My Books', href: '/my-books', color: 'orange' },
              { icon: '🔍', label: 'Browse', href: '/search', color: 'sky' },
              { icon: '📋', label: 'Rentals', href: '/rentals', color: 'emerald' },
            ].map((action, i) => (
              <motion.a
                key={action.label}
                href={action.href}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                whileHover={{ y: -2 }}
                className={`glass rounded-2xl p-5 flex items-center gap-4 group cursor-pointer
                           hover:border-${action.color}-500/25 transition-all duration-300`}
              >
                <div className={`w-11 h-11 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/20
                               flex items-center justify-center text-xl
                               group-hover:scale-110 transition-transform duration-300`}>
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <p className="text-xs text-zinc-600">View →</p>
                </div>
              </motion.a>
            ))}
          </motion.div>

          {/* Add Book Section */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-0">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="text-orange-400">+</span> List a Book
                </h2>
                <p className="text-zinc-500 text-sm mt-1">Share your books and start earning</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddBook(!showAddBook)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  showAddBook
                    ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border border-white/5'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                }`}
              >
                {showAddBook ? '✕ Cancel' : '+ Add Book'}
              </motion.button>
            </div>

            <AnimatePresence>
              {showAddBook && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Book Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Atomic Habits" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Author</label>
                        <input type="text" name="author" value={formData.author} onChange={handleChange} required placeholder="e.g. James Clear" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Price (₹ Book Value)</label>
                        <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="200" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Genre</label>
                        <select name="genre" value={formData.genre} onChange={handleChange} required className={inputCls}>
                          <option value="">Select genre…</option>
                          {GENRES.map(g => (
                            <option key={g} value={g}>{g}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className={labelCls}>Condition</label>
                        <div className="flex flex-wrap gap-2">
                          {CONDITIONS.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData({ ...formData, condition: c })}
                              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                formData.condition === c
                                  ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                                  : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Cover Image URL</label>
                        <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Description</label>
                      <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder="A brief description of the book…" className={inputCls + " resize-none"} />
                    </div>

                    {/* Preview */}
                    {formData.coverImage && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-xl border border-white/5"
                      >
                        <img src={formData.coverImage} alt="Preview" className="w-16 h-20 object-cover rounded-lg" onError={(e) => e.target.style.display = 'none'} />
                        <div>
                          <p className="text-xs text-zinc-500">Cover Preview</p>
                          <p className="text-sm font-medium text-white">{formData.title || 'Book Title'}</p>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 bg-white text-black rounded-xl font-bold text-sm
                                 hover:bg-orange-50 transition-colors shadow-md
                                 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                          Listing…
                        </span>
                      ) : (
                        '+ List Book for Rent'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {!showAddBook && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 text-center"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-4xl mb-3"
                >
                  📚
                </motion.div>
                <p className="text-sm text-zinc-600">Click "Add Book" to start sharing your collection</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
