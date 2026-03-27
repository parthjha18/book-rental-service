import { useState, useEffect } from 'react';
import API from '../services/api';
import BookCard from '../components/BookCard';
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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Books</h1>
          <p className="text-zinc-400 mt-1 text-sm">Books you've listed for rent</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Loading your books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-xl font-semibold text-white">No books listed</p>
            <p className="text-zinc-500 text-sm mt-2">Go to Dashboard to add your first book</p>
          </div>
        ) : (
          <>
            <p className="text-zinc-500 text-sm mb-6">{books.length} book{books.length !== 1 ? 's' : ''} listed</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <div key={book._id}>
                  <BookCard book={book} />
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(book._id)}
                      disabled={!book.isAvailable}
                      className="w-full text-sm py-2.5 rounded-xl font-semibold transition-all border border-red-500/30 text-red-400 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {book.isAvailable ? '🗑 Delete Book' : '🔒 Currently Rented'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyBooks;
