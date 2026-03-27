// Get user's current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
};

// Format currency
export const formatCurrency = (amount) => {
  return `₹${amount}`;
};

// Format date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate rental details
export const calculateRentalDetails = (bookPrice, weeks = 1) => {
  const weeklyRent = 40;
  const securityDepositPercentage = 20;
  const securityDeposit = Math.round((bookPrice * securityDepositPercentage) / 100);
  const totalRent = weeklyRent * weeks;
  const totalAmount = totalRent + securityDeposit;

  return {
    weeklyRent,
    weeks,
    totalRent,
    securityDeposit,
    totalAmount,
  };
};

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
