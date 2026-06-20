const mongoose = require('mongoose');

const testSchema = new mongoose.Schema(
  {
    testCode: { type: String, required: true, unique: true, trim: true },
    testName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Hematology','Biochemistry','Hormones','Infection',
        'Urine','Stool','Vitamins','Oncology','Serology',
        'Microbiology','Other',
      ],
    },
    sampleType: {
      type: String,
      required: true,
      enum: ['Blood','Urine','Stool','Serum','Plasma','Other'],
    },
    mrp: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, default: null },
    description: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

testSchema.index({ testName: 'text', testCode: 'text' });

module.exports = mongoose.model('Test', testSchema);
