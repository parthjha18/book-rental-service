import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import EmptyState from '../components/ui/EmptyState';
import PageWrapper from '../components/ui/PageWrapper';
import toast from 'react-hot-toast';

const statusConfig = {
  pending_payment:  { label: 'Pending Payment', icon: '⏳', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
  payment_completed:{ label: 'Payment Done',    icon: '✅', cls: 'bg-sky-500/15 text-sky-400 border-sky-500/25' },
  in_progress:      { label: 'In Progress',     icon: '📖', cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
  completed:        { label: 'Completed',        icon: '🎉', cls: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/25' },
  cancelled:        { label: 'Cancelled',         icon: '✕', cls: 'bg-red-500/15 text-red-400 border-red-500/25' },
};

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState('borrowed');
  const [rentals, setRentals] = useState([]);
  const [booksRented, setBooksRented] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRentals = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'borrowed') {
        const { data } = await API.get('/transactions/my-rentals');
        if (data.success) setRentals(data.data);
      } else {
        const { data } = await API.get('/transactions/my-books-rented');
        if (data.success) setBooksRented(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch rentals');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchRentals(); }, [fetchRentals]);

  const handleConfirmExchange = async (id) => {
    try {
      const { data } = await API.post(`/transactions/${id}/confirm-exchange`);
      if (data.success) { toast.success(data.message); fetchRentals(); }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm exchange');
    }
  };

  const handleConfirmReturn = async (id) => {
    try {
      const { data } = await API.post(`/transactions/${id}/confirm-return`);
      if (data.success) { toast.success(data.message); fetchRentals(); }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to confirm return');
    }
  };

  const renderTransaction = (t, i) => {
    const isOwner = activeTab === 'lent';
    const other = isOwner ? t.renter : t.owner;
    const status = statusConfig[t.status] || { label: t.status, icon: '●', cls: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    const needsExchange = t.status === 'payment_completed' && ((isOwner && !t.exchangeConfirmedByOwner) || (!isOwner && !t.exchangeConfirmedByRenter));
    const needsReturn = t.status === 'in_progress' && ((isOwner && !t.returnConfirmedByOwner) || (!isOwner && !t.returnConfirmedByRenter));

    return (
      <motion.div
        key={t._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="glass rounded-2xl p-6 mb-4 hover:border-white/10 transition-all duration-300 card-hover"
      >
        <div className="flex gap-5 mb-5">
          {/* Book cover */}
          <div className="relative flex-shrink-0 overflow-hidden rounded-xl">
            <img
              src={t.book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop'}
              alt={t.book.title}
              className="w-20 h-28 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">{t.book.title}</h3>
                <p className="text-zinc-400 text-sm mt-0.5">{t.book.author}</p>
                <p className="text-zinc-500 text-sm mt-2">
                  {isOwner ? 'Rented to' : 'Rented from'}:{' '}
                  <span className="text-white font-medium">{other?.name}</span>
                  {other?.phone && <span className="text-zinc-600"> · {other.phone}</span>}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold ${status.cls}`}>
                  <span>{status.icon}</span> {status.label}
                </span>
                <p className="text-xl font-bold text-orange-400 mt-2">{formatCurrency(t.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Duration', val: `${t.rentalWeeks} week(s)` },
            { label: 'Weekly Rent', val: formatCurrency(t.weeklyRent) },
            { label: 'Deposit', val: formatCurrency(t.securityDeposit) },
            { label: 'Payment', val: t.paymentDetails?.paymentStatus || '-' },
          ].map(({ label, val }) => (
            <div key={label} className="bg-zinc-900/50 border border-white/5 rounded-xl p-3">
              <p className="text-[10px] text-zinc-600 mb-1 uppercase tracking-wider font-semibold">{label}</p>
              <p className="text-sm font-semibold text-white capitalize">{val}</p>
            </div>
          ))}
        </div>

        {t.rentalStartDate && (
          <div className="flex gap-4 text-xs text-zinc-500 mb-4">
            <span className="flex items-center gap-1.5">📅 Started: {formatDate(t.rentalStartDate)}</span>
            <span className="flex items-center gap-1.5">📅 Return by: {formatDate(t.expectedReturnDate)}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 flex-wrap">
          {needsExchange && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleConfirmExchange(t._id)}
              className="px-5 py-2.5 bg-sky-500/15 border border-sky-500/25 text-sky-400 text-sm font-semibold rounded-xl hover:bg-sky-500/25 transition-colors"
            >
              ✓ Confirm Book Exchange
            </motion.button>
          )}
          {needsReturn && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleConfirmReturn(t._id)}
              className="px-5 py-2.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-sm font-semibold rounded-xl hover:bg-emerald-500/25 transition-colors"
            >
              ✓ Confirm Book Return
            </motion.button>
          )}
        </div>

        {t.status === 'payment_completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-4 bg-amber-500/8 border border-amber-500/15 rounded-xl text-xs text-amber-400 flex items-start gap-2"
          >
            <span className="text-base mt-px">💡</span>
            <span>
              <strong>Next step: </strong>Meet with {other?.name} in person to exchange the book. Both parties must confirm.
            </span>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const activeList = activeTab === 'borrowed' ? rentals : booksRented;

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-6 py-10 max-w-3xl">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white tracking-tight">My Rentals</h1>
            <p className="text-zinc-500 mt-1 text-sm">Track your borrowed and lent books</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="flex gap-1 glass rounded-xl p-1 mb-8 w-fit"
          >
            {['borrowed', 'lent'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab ? 'text-black' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="rental-tab-bg"
                    className="absolute inset-0 bg-white rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {tab === 'borrowed' ? '📖 Borrowed' : '📤 Lent Out'}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20"
              >
                <div className="relative w-12 h-12 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-orange-500 animate-spin" />
                </div>
                <p className="text-zinc-500 text-sm">Loading rentals…</p>
              </motion.div>
            ) : activeList.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <EmptyState
                  icon={activeTab === 'borrowed' ? '📖' : '📤'}
                  title={activeTab === 'borrowed' ? 'No rentals yet' : 'No books lent out'}
                  description={activeTab === 'borrowed' ? 'Browse books and start renting!' : 'Add books to your collection to start earning!'}
                />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {activeList.map((t, i) => renderTransaction(t, i))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyRentals;
