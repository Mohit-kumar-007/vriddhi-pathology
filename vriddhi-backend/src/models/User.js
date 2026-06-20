const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: '' },
    passwordHash: { type: String, required: true },
    age: { type: Number, min: 1, max: 120 },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String, trim: true, default: '' },
    pincode: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
