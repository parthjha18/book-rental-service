import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { formatCurrency, calculateRentalDetails, loadRazorpayScript } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

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
          color: '#2563eb',
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
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">{book.description}</p>
              <p className="text-sm text-gray-500">Genre: {book.genre}</p>
              <p className="text-sm text-gray-500">Condition: {book.condition}</p>
              <p className="text-lg font-semibold mt-2">
                Book Value: {formatCurrency(book.price)}
              </p>
            </div>

            {book.owner && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Book Owner</h3>
                <p className="text-sm">Name: {book.owner.name}</p>
                <p className="text-sm">Phone: {book.owner.phone}</p>
                <p className="text-sm">Location: {book.owner.location.address}, {book.owner.location.city}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Rental Duration (weeks)
              </label>
              <input
                type="number"
                value={weeks}
                onChange={(e) => setWeeks(parseInt(e.target.value) || 1)}
                min="1"
                max="12"
                className="w-32 px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-3">Rental Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Weekly Rent:</span>
                  <span>{formatCurrency(rentalDetails.weeklyRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>{rentalDetails.weeks} week(s)</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Rent:</span>
                  <span>{formatCurrency(rentalDetails.totalRent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Security Deposit (20%):</span>
                  <span>{formatCurrency(rentalDetails.securityDeposit)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">
                    {formatCurrency(rentalDetails.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-yellow-50 rounded">
              <h4 className="font-semibold mb-2 text-sm">Important Notes:</h4>
              <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                <li>Payment includes security deposit (refundable)</li>
                <li>Meet with the owner in person to exchange the book</li>
                <li>Both parties must confirm the exchange</li>
                <li>Return the book on time to avoid penalties</li>
                <li>Security deposit will be refunded after successful return</li>
              </ul>
            </div>

            <button
              onClick={handlePayment}
              disabled={processing || !book.isAvailable}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay ${formatCurrency(rentalDetails.totalAmount)} & Rent Book`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentBook;
