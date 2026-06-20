const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    patientName: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 1, max: 120 },
    gender: { type: String, enum: ['Male','Female','Other'], required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    pincode: { type: String, required: true },
    selectedTests: [
      {
        testId: { type: String },
        testName: { type: String },
        offerPrice: { type: Number },
      },
    ],
    preferredDate: { type: Date, required: true },
    preferredSlot: {
      type: String,
      required: true,
      enum: ['9AM-11AM','11AM-1PM','1PM-3PM','3PM-5PM','5PM-7PM'],
    },
    notes: { type: String, default: '' },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending','confirmed','collected','completed','cancelled'],
      default: 'pending',
    },
    whatsappLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
