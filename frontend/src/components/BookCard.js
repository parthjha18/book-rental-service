import { formatCurrency } from '../utils/helpers';
import { motion } from 'framer-motion';

const BookCard = ({ book, onRent, onAddToWishlist, showDistance = false, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group relative bg-zinc-950 border border-white/7 rounded-2xl overflow-hidden
                 hover:border-orange-500/25 transition-all duration-300 shine glow-orange"
    >
      {/* Cover image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop'}
          alt={book.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Dark gradient overlay at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent" />

        {/* Availability badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold backdrop-blur-sm ${
            book.isAvailable ? 'badge-green' : 'badge-red'
          }`}>
            {book.isAvailable ? '● Available' : '● Rented'}
          </span>
        </div>

        {/* Genre badge */}
        {book.genre && (
          <span className="absolute top-3 left-3 text-[11px] px-2.5 py-1 rounded-full
                           bg-black/50 backdrop-blur-sm text-zinc-300 border border-white/10 font-medium">
            {book.genre}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 pt-3">
        <h3 className="text-sm font-bold text-white mb-0.5 line-clamp-1 leading-snug">{book.title}</h3>
        <p className="text-xs text-zinc-500 mb-2">by {book.author}</p>
        <p className="text-xs text-zinc-600 mb-3 line-clamp-2 leading-relaxed">{book.description}</p>

        {/* Price + distance */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-orange-400">{formatCurrency(book.price)}</span>
            <span className="text-[10px] text-zinc-600">/week</span>
          </div>
          {showDistance && book.distance !== undefined && (
            <span className="text-[11px] text-zinc-500 flex items-center gap-1">
              <span className="text-xs">📍</span> {book.distance} km
            </span>
          )}
        </div>

        {/* Owner */}
        {book.owner && (
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/5">
            <div className="w-5 h-5 rounded-full bg-orange-400/20 flex items-center justify-center text-[10px] font-bold text-orange-400 flex-shrink-0">
              {book.owner.name?.charAt(0)}
            </div>
            <span className="text-[11px] text-zinc-500 truncate">
              {book.owner.name} · {book.owner.location?.city}
            </span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {book.isAvailable && onRent && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onRent(book)}
              className="flex-1 bg-white text-black px-3 py-2 rounded-xl text-xs font-bold
                         hover:bg-orange-50 transition-colors shadow-md hover:shadow-orange-500/20"
            >
              Rent Now →
            </motion.button>
          )}
          {!book.isAvailable && onAddToWishlist && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onAddToWishlist(book)}
              className="flex-1 bg-amber-500/12 text-amber-400 border border-amber-500/25
                         px-3 py-2 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-colors"
            >
              ♥ Wishlist
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
