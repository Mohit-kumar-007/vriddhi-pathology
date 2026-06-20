const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    targetGender: { type: String, enum: ['Male','Female','All'], default: 'All' },
    includedTests: [{ type: String }],
    mrp: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    badge: {
      type: String,
      enum: ['Most Popular','Best Value','Allergy',null],
      default: null,
    },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Package', packageSchema);
