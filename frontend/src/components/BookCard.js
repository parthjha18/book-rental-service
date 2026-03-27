import { formatCurrency } from '../utils/helpers';

const BookCard = ({ book, onRent, onAddToWishlist, showDistance = false }) => {
  return (
    <div className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-600 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop'}
          alt={book.title}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
            book.isAvailable
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {book.isAvailable ? 'Available' : 'Rented'}
          </span>
        </div>
        {book.genre && (
          <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full bg-black/60 text-zinc-300 border border-white/10">
            {book.genre}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-zinc-400 mb-1">by {book.author}</p>
        <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{book.description}</p>

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-orange-400">{formatCurrency(book.price)}<span className="text-xs text-zinc-500 font-normal">/week</span></span>
          {showDistance && book.distance !== undefined && (
            <span className="text-xs text-zinc-500">📍 {book.distance} km</span>
          )}
        </div>

        {book.owner && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-zinc-800">
            <div className="w-6 h-6 rounded-full bg-orange-400/20 flex items-center justify-center text-xs font-bold text-orange-400">
              {book.owner.name?.charAt(0)}
            </div>
            <span className="text-xs text-zinc-500">{book.owner.name} · {book.owner.location?.city}</span>
          </div>
        )}

        <div className="flex gap-2">
          {book.isAvailable && onRent && (
            <button
              onClick={() => onRent(book)}
              className="flex-1 bg-white text-black px-3 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors"
            >
              Rent Now
            </button>
          )}
          {!book.isAvailable && onAddToWishlist && (
            <button
              onClick={() => onAddToWishlist(book)}
              className="flex-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-amber-500/30 transition-colors"
            >
              ♥ Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
