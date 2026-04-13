import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import BookCard from '../components/BookCard';
import { SkeletonBookGrid } from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import PageWrapper from '../components/ui/PageWrapper';
import toast from 'react-hot-toast';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', genre: '', available: true, nearby: true, maxDistance: 10 });
  const navigate = useNavigate();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = filters.nearby ? '/books/nearby' : '/books';
      const params = filters.nearby
        ? { maxDistance: filters.maxDistance * 1000 }
        : { search: filters.search, genre: filters.genre, available: filters.available };
      const { data } = await API.get(endpoint, { params });
      if (data.success) setBooks(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchBooks(); }, []);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({ ...filters, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSearch = (e) => { e.preventDefault(); fetchBooks(); };
  const handleRent = (book) => navigate(`/rent/${book._id}`, { state: { book } });
  const handleAddToWishlist = async (book) => {
    try {
      const { data } = await API.post(`/books/${book._id}/wishlist`);
      if (data.success) toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-10">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white tracking-tight">Browse Books</h1>
            <p className="text-zinc-500 mt-1 text-sm">Discover books available near you</p>
          </motion.div>

          {/* Filter bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                {/* Nearby toggle */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="nearby"
                      checked={filters.nearby}
                      onChange={handleFilterChange}
                      className="sr-only"
                    />
                    <div className={`w-12 h-7 rounded-full transition-colors duration-300 ${filters.nearby ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                      <motion.div
                        animate={{ x: filters.nearby ? 22 : 3 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        className="w-5 h-5 bg-white rounded-full shadow-md mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Nearby Only</span>
                    <p className="text-[11px] text-zinc-600">Show books in your area</p>
                  </div>
                </label>

                {filters.nearby ? (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">Max Distance (km)</label>
                    <input type="number" name="maxDistance" value={filters.maxDistance} onChange={handleFilterChange} min="1" max="50" className="input-premium" />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">Search</label>
                      <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Title, author, genre..."
                        className="input-premium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">Genre</label>
                      <input type="text" name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Fiction, Self-Help..." className="input-premium" />
                    </div>
                  </>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors w-full shadow-md"
                >
                  Search →
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* Results */}
          {loading ? (
            <SkeletonBookGrid count={8} />
          ) : books.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No books found"
              description="Try adjusting your search filters or expanding the distance range"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-zinc-500 text-sm mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {books.length} book{books.length !== 1 ? 's' : ''} found
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book, i) => (
                  <BookCard key={book._id} book={book} onRent={handleRent} onAddToWishlist={handleAddToWishlist} showDistance={filters.nearby} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SearchBooks;
