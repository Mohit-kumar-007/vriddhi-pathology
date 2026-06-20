require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Settings = require('../models/Settings');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

async function seedSettings() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  const existing = await Settings.findOne();
  if (!existing) {
    await Settings.create({
      globalDiscountPercent: 30,
      seniorCitizenExtraDiscount: 10,
      familyDiscountPercent: 10,
      freeHomeCollection: true,
      offerBannerText:
        '30% OFF on All Tests | 10% Extra for Senior Citizens (60+) | Free Home Collection* | Family Discount: 10% off for 3+ members',
      labTimings: '9:00 AM – 8:00 PM, 7 Days a Week',
      labPhone: '9026578856',
      labEmail: 'vriddhipathology@gmail.com',
      labAddress: 'Jagdish Saray, Chandauli 232104, Uttar Pradesh',
    });
    console.log('✅ Settings seeded');
  } else {
    console.log('ℹ️  Settings already exist, skipping');
  }

  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const hash = await bcrypt.hash('vriddhi@admin123', 10);
    await Admin.create({
      username: 'admin',
      passwordHash: hash,
      mustChangePassword: true,
    });
    console.log('✅ Admin created: admin / vriddhi@admin123');
  } else {
    console.log('ℹ️  Admin already exists, skipping');
  }

  await mongoose.disconnect();
}

seedSettings().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
