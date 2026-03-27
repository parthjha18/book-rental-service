import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import toast from 'react-hot-toast';

const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm";

const Dashboard = () => {
  const { user } = useAuth();
  const [showAddBook, setShowAddBook] = useState(false);
  const [formData, setFormData] = useState({
    title: '', author: '', description: '', price: '', genre: '', condition: 'Good', coverImage: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/books', formData);
      if (data.success) {
        toast.success(data.message);
        setFormData({ title: '', author: '', description: '', price: '', genre: '', condition: 'Good', coverImage: '' });
        setShowAddBook(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add book');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        {/* Welcome Banner */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl font-bold text-orange-400">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h1>
              <p className="text-zinc-400 text-sm">Manage your books and rentals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">📍 Location</p>
              <p className="text-sm font-semibold text-white">{user?.location?.city}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{user?.location?.address}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">✉️ Email</p>
              <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">📞 Phone</p>
              <p className="text-sm font-semibold text-white">{user?.phone}</p>
            </div>
          </div>
        </div>

        {/* Add Book Section */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">List a Book</h2>
              <p className="text-zinc-500 text-sm mt-1">Share your books and start earning</p>
            </div>
            <button
              onClick={() => setShowAddBook(!showAddBook)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                showAddBook
                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
            >
              {showAddBook ? 'Cancel' : '+ Add Book'}
            </button>
          </div>

          {showAddBook && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Book Title</label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Atomic Habits" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Author</label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} required placeholder="e.g. James Clear" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Price (₹/week)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleChange} required min="0" placeholder="40" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Genre</label>
                  <input type="text" name="genre" value={formData.genre} onChange={handleChange} required placeholder="Fiction, Self-Help..." className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Condition</label>
                  <select name="condition" value={formData.condition} onChange={handleChange} className={inputClass}>
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Cover Image URL</label>
                  <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange} placeholder="https://..." className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" placeholder="A brief description of the book..." className={inputClass + " resize-none"} />
              </div>
              <button type="submit" className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors">
                + List Book
              </button>
            </form>
          )}

          {!showAddBook && (
            <div className="text-center py-8 text-zinc-600">
              <p className="text-4xl mb-3">📚</p>
              <p className="text-sm">Click "Add Book" to start sharing your collection</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
