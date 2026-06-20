const { createObjectCsvStringifier } = require('csv-writer');

module.exports = function exportBookingsCSV(bookings) {
  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'bookingId', title: 'Booking ID' },
      { id: 'patientName', title: 'Patient Name' },
      { id: 'age', title: 'Age' },
      { id: 'gender', title: 'Gender' },
      { id: 'phone', title: 'Phone' },
      { id: 'address', title: 'Address' },
      { id: 'pincode', title: 'Pincode' },
      { id: 'tests', title: 'Tests Booked' },
      { id: 'preferredDate', title: 'Preferred Date' },
      { id: 'preferredSlot', title: 'Time Slot' },
      { id: 'totalAmount', title: 'Total Amount (Rs.)' },
      { id: 'status', title: 'Status' },
      { id: 'notes', title: 'Notes' },
      { id: 'createdAt', title: 'Booked At' },
    ],
  });

  const records = bookings.map((b) => ({
    bookingId: b.bookingId,
    patientName: b.patientName,
    age: b.age,
    gender: b.gender,
    phone: b.phone,
    address: b.address,
    pincode: b.pincode,
    tests: b.selectedTests.map((t) => t.testName).join('; '),
    preferredDate: new Date(b.preferredDate).toLocaleDateString('en-IN'),
    preferredSlot: b.preferredSlot,
    totalAmount: b.totalAmount,
    status: b.status,
    notes: b.notes || '',
    createdAt: new Date(b.createdAt).toLocaleString('en-IN'),
  }));

  return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
};
