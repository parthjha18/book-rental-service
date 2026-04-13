import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import BookCard from '../components/BookCard';
import { SkeletonBookGrid } from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import PageWrapper from '../components/ui/PageWrapper';
import toast from 'react-hot-toast';

const MyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchMyBooks(); }, []);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/books/user/my-books');
      if (data.success) setBooks(data.data);
    } catch (error) {
      toast.error('Failed to fetch your books');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        const { data } = await API.delete(`/books/${bookId}`);
        if (data.success) { toast.success(data.message); fetchMyBooks(); }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete book');
      }
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">My Books</h1>
              <p className="text-zinc-500 mt-1 text-sm">Books you've listed for rent</p>
            </div>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500
                         text-white rounded-xl text-sm font-semibold shadow-lg shadow-orange-500/20
                         hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              + Add Book
            </Link>
          </motion.div>

          {loading ? (
            <SkeletonBookGrid count={8} />
          ) : books.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No books listed"
              description="Go to Dashboard to add your first book and start earning!"
              action={
                <Link to="/dashboard" className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors shadow-md">
                  + Add Your First Book
                </Link>
              }
            />
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <p className="text-zinc-500 text-sm mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
                {books.length} book{books.length !== 1 ? 's' : ''} listed
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book, i) => (
                  <motion.div
                    key={book._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <BookCard book={book} index={i} />
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleDelete(book._id)}
                      disabled={!book.isAvailable}
                      className="w-full mt-2 text-sm py-2.5 rounded-xl font-semibold transition-all border border-red-500/30
                                 text-red-400 hover:bg-red-500/15 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {book.isAvailable ? '🗑 Delete Book' : '🔒 Currently Rented'}
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyBooks;
