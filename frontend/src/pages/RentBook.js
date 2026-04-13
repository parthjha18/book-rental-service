import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import API from '../services/api';
import { formatCurrency, calculateRentalDetails, loadRazorpayScript } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import { PageLoader } from '../components/ui/SkeletonLoader';

const RentBook = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState(location.state?.book || null);
  const [weeks, setWeeks] = useState(1);
  const [rentalDetails, setRentalDetails] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await API.get(`/books/${id}`);
        if (data.success) {
          setBook(data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch book details');
        navigate('/search');
      }
    };

    if (!book) {
      fetchBook();
    }
  }, [id, book, navigate]);

  useEffect(() => {
    if (book) {
      const details = calculateRentalDetails(book.price, weeks);
      setRentalDetails(details);
    }
  }, [book, weeks]);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Create order
      const { data: orderData } = await API.post('/transactions/create-order', {
        bookId: book._id,
        rentalWeeks: weeks,
      });

      if (!orderData.success) {
        toast.error('Failed to create order');
        setProcessing(false);
        return;
      }
      
      const keyId = process.env.REACT_APP_RAZORPAY_KEY_ID || orderData.data.razorpayKeyId;

      // 🛑 MOCK PAYMENT PROCESS IF NO REAL KEYS
      if (!keyId || keyId === "your_razorpay_key_id" || keyId === "dummy") {
        try {
          const { data: verifyData } = await API.post('/transactions/verify-payment', {
            razorpayOrderId: orderData.data.orderId,
            razorpayPaymentId: `mock_pay_${Date.now()}`,
            razorpaySignature: 'mock_signature',
            transactionId: orderData.data.transaction._id,
            testingBypass: true
          });

          if (verifyData.success) {
            toast.success('Test Payment successful! Book rental initiated.');
            navigate('/rentals'); // Just navigating back to safely show success
          }
        } catch (error) {
          toast.error('Mock Payment verification failed');
        }
        setProcessing(false);
        return;
      }

      // Load Razorpay script normally if keys are present
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway');
        setProcessing(false);
        return;
      }

      // Razorpay options
      const options = {
        key: keyId,
        amount: orderData.data.amount * 100,
        currency: orderData.data.currency,
        name: 'BookShare',
        description: `Rent: ${book.title}`,
        order_id: orderData.data.orderId,
        handler: async function (response) {
          // Verify payment
          try {
            const { data: verifyData } = await API.post('/transactions/verify-payment', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              transactionId: orderData.data.transaction._id,
            });

            if (verifyData.success) {
              toast.success('Payment successful! Book rental initiated.');
              navigate('/rentals');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: '#f97316',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.');
        setProcessing(false);
      });

      razorpay.open();
      setProcessing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Payment failed');
      setProcessing(false);
    }
  };

  if (!book || !rentalDetails) {
    return <PageLoader message="Loading book details..." />;
  }

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-5xl">

          {/* Back button */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium mb-8 group transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to search
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Left — Book Details */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-2/5"
            >
              {/* Book Cover */}
              <div className="relative group overflow-hidden rounded-2xl mb-6">
                <img
                  src={book.coverImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop'}
                  alt={book.title}
                  className="w-full h-72 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Floating badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {book.genre && (
                    <span className="text-[11px] px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-zinc-200 border border-white/10 font-medium">
                      {book.genre}
                    </span>
                  )}
                  <span className="text-[11px] px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-zinc-200 border border-white/10 font-medium">
                    {book.condition}
                  </span>
                </div>

                {/* Availability */}
                <div className="absolute top-4 right-4">
                  <span className={`text-[11px] px-3 py-1 rounded-full font-semibold backdrop-blur-sm ${
                    book.isAvailable ? 'badge-green' : 'badge-red'
                  }`}>
                    {book.isAvailable ? '● Available' : '● Rented'}
                  </span>
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-1">{book.title}</h1>
                  <p className="text-zinc-300 text-sm">by {book.author}</p>
                </div>
              </div>

              {/* Description */}
              <div className="glass rounded-2xl p-6 mb-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">About this book</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{book.description}</p>
              </div>

              {/* Owner Card */}
              {book.owner && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Book Owner</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-lg font-bold text-orange-400 flex-shrink-0">
                      {book.owner.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{book.owner.name}</p>
                      <p className="text-xs text-zinc-500">{book.owner.phone}</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        📍 {book.owner.location?.address}, {book.owner.location?.city}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Right — Rental Config */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="lg:w-3/5 flex flex-col gap-6"
            >
              {/* Duration picker */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Rental Duration</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-zinc-900 rounded-xl border border-white/8 overflow-hidden">
                    <button
                      onClick={() => setWeeks(Math.max(1, weeks - 1))}
                      className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg font-medium"
                    >
                      −
                    </button>
                    <div className="px-6 py-3 text-center min-w-[80px]">
                      <span className="text-2xl font-bold text-white">{weeks}</span>
                    </div>
                    <button
                      onClick={() => setWeeks(Math.min(12, weeks + 1))}
                      className="px-4 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-zinc-500 text-sm font-medium">week{weeks !== 1 ? 's' : ''}</span>
                </div>

                {/* Quick duration buttons */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {[1, 2, 4, 8, 12].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeeks(w)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        weeks === w
                          ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                          : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
                      }`}
                    >
                      {w}w
                    </button>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-5">Price Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Weekly Rent', value: formatCurrency(rentalDetails.weeklyRent) },
                    { label: 'Duration', value: `${rentalDetails.weeks} week${rentalDetails.weeks !== 1 ? 's' : ''}` },
                    { label: 'Total Rent', value: formatCurrency(rentalDetails.totalRent) },
                    { label: 'Security Deposit (20%)', value: formatCurrency(rentalDetails.securityDeposit), note: 'Refundable' },
                  ].map(({ label, value, note }) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-sm text-zinc-400">
                        {label}
                        {note && <span className="ml-2 text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{note}</span>}
                      </span>
                      <span className="text-sm font-semibold text-white">{value}</span>
                    </div>
                  ))}

                  <div className="section-divider my-2" />

                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <motion.span
                      key={rentalDetails.totalAmount}
                      initial={{ scale: 1.1, color: '#f97316' }}
                      animate={{ scale: 1, color: '#fb923c' }}
                      className="text-2xl font-bold text-orange-400"
                    >
                      {formatCurrency(rentalDetails.totalAmount)}
                    </motion.span>
                  </div>
                </div>
              </div>

              {/* Important notes */}
              <div className="rounded-2xl p-5 bg-amber-500/5 border border-amber-500/15">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span>⚠️</span> Important Notes
                </h4>
                <ul className="text-xs text-zinc-400 space-y-2 leading-relaxed">
                  {[
                    'Payment includes security deposit (refundable on return)',
                    'Meet with the owner in person to exchange the book',
                    'Both parties must confirm the exchange',
                    'Return the book on time to avoid penalties',
                    'Security deposit will be refunded after successful return',
                  ].map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500/50 mt-0.5 text-[10px]">●</span>
                      {note}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment button */}
              <motion.button
                onClick={handlePayment}
                disabled={processing || !book.isAvailable}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-bold text-base
                           hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none relative overflow-hidden"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    🔐 Pay {formatCurrency(rentalDetails.totalAmount)} & Rent Book
                  </span>
                )}
              </motion.button>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-zinc-600">
                <span>🔒</span>
                <span>Secured by Razorpay · 256-bit encryption</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RentBook;
