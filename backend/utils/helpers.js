// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km

  return distance;
};

// Calculate security deposit based on book price
const calculateSecurityDeposit = (bookPrice) => {
  const percentage = parseInt(process.env.SECURITY_DEPOSIT_PERCENTAGE) || 20;
  return Math.round((bookPrice * percentage) / 100);
};

// Calculate total amount for rental
const calculateRentalAmount = (bookPrice, weeks = 1) => {
  const weeklyRent = parseInt(process.env.WEEKLY_RENT) || 40;
  const securityDeposit = calculateSecurityDeposit(bookPrice);
  const totalRent = weeklyRent * weeks;

  return {
    weeklyRent,
    rentalWeeks: weeks,
    rentAmount: totalRent,
    securityDeposit,
    totalAmount: totalRent + securityDeposit,
  };
};

module.exports = {
  calculateDistance,
  calculateSecurityDeposit,
  calculateRentalAmount,
};
