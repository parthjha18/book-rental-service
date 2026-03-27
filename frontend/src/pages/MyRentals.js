import { useState, useEffect } from 'react';
import API from '../services/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const statusConfig = {
  pending_payment: { label: 'Pending Payment', cls: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  payment_completed: { label: 'Payment Done', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_progress: { label: 'In Progress', cls: 'bg-green-500/20 text-green-400 border-green-500/30' },
  completed: { label: 'Completed', cls: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const MyRentals = () => {
  const [activeTab, setActiveTab] = useState('borrowed');
  const [rentals, setRentals] = useState([]);
  const [booksRented, setBooksRented] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchRentals(); }, [activeTab]);

  const fetchRentals = async () => {
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
  };

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

  const renderTransaction = (t) => {
    const isOwner = activeTab === 'lent';
    const other = isOwner ? t.renter : t.owner;
    const status = statusConfig[t.status] || { label: t.status, cls: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    const needsExchange = t.status === 'payment_completed' && ((isOwner && !t.exchangeConfirmedByOwner) || (!isOwner && !t.exchangeConfirmedByRenter));
    const needsReturn = t.status === 'in_progress' && ((isOwner && !t.returnConfirmedByOwner) || (!isOwner && !t.returnConfirmedByRenter));

    return (
      <div key={t._id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 mb-4 hover:border-zinc-700 transition-colors">
        <div className="flex gap-5 mb-5">
          <img
            src={t.book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200&auto=format&fit=crop'}
            alt={t.book.title}
            className="w-20 h-28 object-cover rounded-xl flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-3">
              <div>
                <h3 className="font-bold text-lg text-white leading-tight">{t.book.title}</h3>
                <p className="text-zinc-400 text-sm mt-0.5">{t.book.author}</p>
                <p className="text-zinc-500 text-sm mt-2">
                  {isOwner ? 'Rented to' : 'Rented from'}:{' '}
                  <span className="text-white font-medium">{other?.name}</span>
                  {other?.phone && <span className="text-zinc-500"> · {other.phone}</span>}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold ${status.cls}`}>{status.label}</span>
                <p className="text-xl font-bold text-orange-400 mt-2">{formatCurrency(t.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Duration', val: `${t.rentalWeeks} week(s)` },
            { label: 'Weekly Rent', val: formatCurrency(t.weeklyRent) },
            { label: 'Deposit', val: formatCurrency(t.securityDeposit) },
            { label: 'Payment', val: t.paymentDetails?.paymentStatus || '-' },
          ].map(({ label, val }) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-xs text-zinc-500 mb-1">{label}</p>
              <p className="text-sm font-semibold text-white capitalize">{val}</p>
            </div>
          ))}
        </div>

        {t.rentalStartDate && (
          <div className="flex gap-4 text-xs text-zinc-500 mb-4">
            <span>📅 Started: {formatDate(t.rentalStartDate)}</span>
            <span>📅 Return by: {formatDate(t.expectedReturnDate)}</span>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {needsExchange && (
            <button onClick={() => handleConfirmExchange(t._id)} className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-sm font-semibold rounded-xl hover:bg-blue-500/30 transition-colors">
              ✓ Confirm Book Exchange
            </button>
          )}
          {needsReturn && (
            <button onClick={() => handleConfirmReturn(t._id)} className="px-4 py-2 bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-semibold rounded-xl hover:bg-green-500/30 transition-colors">
              ✓ Confirm Book Return
            </button>
          )}
        </div>

        {t.status === 'payment_completed' && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400">
            <span className="font-semibold">Next step: </span>Meet with {other?.name} in person to exchange the book. Both parties must confirm.
          </div>
        )}
      </div>
    );
  };

  const activeList = activeTab === 'borrowed' ? rentals : booksRented;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-10 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Rentals</h1>
          <p className="text-zinc-400 mt-1 text-sm">Track your borrowed and lent books</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1 mb-6 w-fit">
          {['borrowed', 'lent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab === 'borrowed' ? '📖 Borrowed' : '📤 Lent Out'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-zinc-500">Loading...</p>
          </div>
        ) : activeList.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl">
            <p className="text-4xl mb-4">{activeTab === 'borrowed' ? '📖' : '📤'}</p>
            <p className="text-xl font-semibold text-white">{activeTab === 'borrowed' ? 'No rentals yet' : 'No books lent out'}</p>
            <p className="text-zinc-500 text-sm mt-2">{activeTab === 'borrowed' ? 'Browse books and start renting!' : 'Add books to your collection to start earning!'}</p>
          </div>
        ) : (
          activeList.map((t) => renderTransaction(t))
        )}
      </div>
    </div>
  );
};

export default MyRentals;
