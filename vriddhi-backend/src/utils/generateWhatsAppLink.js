module.exports = function generateWhatsAppLink(booking, labPhone) {
  const testNames = booking.selectedTests.map((t) => t.testName).join(', ');
  const date = new Date(booking.preferredDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const message = [
    `New Booking Request - Vriddhi Pathology Lab`,
    `Booking ID: ${booking.bookingId}`,
    `Patient: ${booking.patientName} | Age: ${booking.age} | ${booking.gender}`,
    `Phone: ${booking.phone}`,
    `Tests: ${testNames}`,
    `Date: ${date} | Slot: ${booking.preferredSlot}`,
    `Address: ${booking.address} - ${booking.pincode}`,
    `Total Amount: Rs. ${booking.totalAmount}`,
  ].join('\n');

  return `https://wa.me/91${labPhone}?text=${encodeURIComponent(message)}`;
};
