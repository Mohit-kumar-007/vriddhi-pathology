export function generateWhatsAppLink(booking, labPhone = '9026578856') {
  const testNames = booking.selectedTests.map(t => t.testName).join(', ');
  const date = new Date(booking.preferredDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const msg = `New Booking Request - Vriddhi Pathology Lab\nBooking ID: ${booking.bookingId}\nPatient: ${booking.patientName} | Age: ${booking.age} | ${booking.gender}\nPhone: ${booking.phone}\nTests: ${testNames}\nDate: ${date} | Slot: ${booking.preferredSlot}\nAddress: ${booking.address} - ${booking.pincode}\nTotal Amount: Rs. ${booking.totalAmount}`;
  return `https://wa.me/91${labPhone}?text=${encodeURIComponent(msg)}`;
}

export function generateWhatsAppContactLink(name, email, message, labPhone = '9026578856') {
  const msg = `Hello Vriddhi Pathology Lab,\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
  return `https://wa.me/91${labPhone}?text=${encodeURIComponent(msg)}`;
}
