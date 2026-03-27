import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import BookCard from '../components/BookCard';
import AnimatedGlowingSearchBar from '../components/ui/animated-glowing-search-bar';
import toast from 'react-hot-toast';

const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm";

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ search: '', genre: '', available: true, nearby: true, maxDistance: 10 });
  const navigate = useNavigate();

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
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
  };

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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Search Books</h1>
          <p className="text-zinc-400 mt-1 text-sm">Discover books available near you</p>
        </div>

        {/* Filter bar */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    name="nearby"
                    checked={filters.nearby}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 rounded-full transition-colors ${filters.nearby ? 'bg-orange-500' : 'bg-zinc-700'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-0.5 ${filters.nearby ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                </div>
                <span className="text-sm font-medium text-zinc-300">Nearby Only</span>
              </label>

              {filters.nearby ? (
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Max Distance (km)</label>
                  <input type="number" name="maxDistance" value={filters.maxDistance} onChange={handleFilterChange} min="1" max="50" className={inputClass} />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Search</label>
                    <AnimatedGlowingSearchBar 
                      name="search" 
                      value={filters.search} 
                      onChange={handleFilterChange} 
                      placeholder="Title, author, genre..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2">Genre</label>
                    <input type="text" name="genre" value={filters.genre} onChange={handleFilterChange} placeholder="Fiction, Self-Help..." className={inputClass} />
                  </div>
                </>
              )}

              <button type="submit" className="px-6 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors w-full">
                Search →
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Finding books near you...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-xl font-semibold text-white">No books found</p>
            <p className="text-zinc-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mb-6">{books.length} book{books.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard key={book._id} book={book} onRent={handleRent} onAddToWishlist={handleAddToWishlist} showDistance={filters.nearby} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBooks;
