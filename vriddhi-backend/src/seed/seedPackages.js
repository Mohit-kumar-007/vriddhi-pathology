require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Package = require('../models/Package');

const packages = [
  {
    name: 'My CRL Package 1',
    targetGender: 'All',
    includedTests: [
      'CBC', 'ESR', 'Glucose Fasting', 'HbA1c',
      'Thyroid Profile Total (T3, T4, TSH)', 'Lipid Profile',
      'Kidney Function Test (KFT)', 'Liver Function Test (LFT)',
      'Iron Profile (Iron Studies with Ferritin)',
      'Vitamin D (25-OH)', 'Vitamin B12',
    ],
    mrp: 6000,
    offerPrice: 2250,
    badge: null,
    sortOrder: 1,
  },
  {
    name: 'My CRL Package 2',
    targetGender: 'All',
    includedTests: [
      'CBC', 'ESR', 'Glucose Fasting', 'HbA1c',
      'Thyroid Profile Total (T3, T4, TSH)', 'Lipid Profile',
      'Kidney Function Test (KFT)', 'Liver Function Test (LFT)',
      'Vitamin D (25-OH)', 'Vitamin B12',
      'Iron Profile (Iron Studies with Ferritin)',
    ],
    mrp: 6000,
    offerPrice: 2000,
    badge: null,
    sortOrder: 2,
  },
  {
    name: 'Male Health Package',
    targetGender: 'Male',
    includedTests: [
      'CBC', 'HbA1c', 'Iron Studies', 'Calcium',
      'Kidney Function Test (KFT)', 'Liver Function Test (LFT)',
      'Lipid Profile', 'Vitamin B12', 'Vitamin D (25-OH)',
      'Transferrin Saturation', 'Testosterone Total', 'TIBC',
    ],
    mrp: 6100,
    offerPrice: 2299,
    badge: null,
    sortOrder: 3,
  },
  {
    name: 'Mega Offer Package',
    targetGender: 'All',
    includedTests: [
      'CBC', 'Glucose Fasting', 'HbA1c',
      'Liver Function Test (LFT)', 'Kidney Function Test (KFT)',
      'Vitamin B12', 'Vitamin D Total',
      'CRP (C-Reactive Protein) Quantitative',
      'Rheumatoid Factor (RA Factor)', 'Total IgE',
      'Thyroid Profile Total (T3, T4, TSH)',
      'Iron Profile', 'Lipid Profile',
    ],
    mrp: 7550,
    offerPrice: 2499,
    badge: 'Most Popular',
    sortOrder: 4,
  },
  {
    name: 'Health Plus Offer',
    targetGender: 'All',
    includedTests: [
      'CBC', 'Glucose Fasting', 'HbA1c',
      'Liver Function Test (LFT)', 'Kidney Function Test (KFT)',
      'Thyroid Profile Total (T3, T4, TSH)',
      'Lipid Profile', 'Blood Group (ABO Group & Rh Type)',
    ],
    mrp: 3100,
    offerPrice: 1299,
    badge: null,
    sortOrder: 5,
  },
  {
    name: 'Allergy Offer',
    targetGender: 'All',
    includedTests: [
      'CBC', 'Total IgE', 'Absolute Eosinophil Count (AEC)',
    ],
    mrp: 1700,
    offerPrice: 899,
    badge: 'Allergy',
    sortOrder: 6,
  },
  {
    name: 'Vriddhi Premium Package',
    targetGender: 'All',
    includedTests: [
      'CBC', 'Glucose Fasting', 'HbA1c', 'Iron Studies',
      'Urea', 'Creatinine', 'Uric Acid', 'Phosphorus Inorganic',
      'Lipid Profile', 'Thyroid Profile Total (T3, T4, TSH)',
    ],
    mrp: 3050,
    offerPrice: 1099,
    badge: 'Best Value',
    sortOrder: 7,
  },
  {
    name: 'Female Health Package',
    targetGender: 'Female',
    includedTests: [
      'CBC', 'Glucose Fasting', 'HbA1c', 'Calcium',
      'Thyroid Profile Total (T3, T4, TSH)',
      'Liver Function Test (LFT)', 'Kidney Function Test (KFT)',
      'Vitamin B12', 'Vitamin D Total',
      'CA 125 Cancer Marker',
      'Rheumatoid Factor (RA Factor)',
      'CRP (C-Reactive Protein) Quantitative',
      'Lipid Profile', 'ESR',
    ],
    mrp: 7700,
    offerPrice: 2499,
    badge: null,
    sortOrder: 8,
  },
];

async function seedPackages() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
  await Package.deleteMany({});
  await Package.insertMany(packages);
  console.log(`✅ ${packages.length} packages seeded`);
  await mongoose.disconnect();
}

seedPackages().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
