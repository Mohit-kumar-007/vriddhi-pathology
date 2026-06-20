const Booking = require('../models/Booking');

module.exports = async function generateBookingId() {
  const year = new Date().getFullYear();
  const count = await Booking.countDocuments();
  const padded = String(count + 1).padStart(4, '0');
  return `VPL-${year}-${padded}`;
};
