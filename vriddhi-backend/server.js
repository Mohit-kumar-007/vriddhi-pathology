require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Auto-create admin if none exists
    const Admin = require('./src/models/Admin');
    const bcrypt = require('bcryptjs');
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hash = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'vriddhi@admin123',
        10
      );
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash: hash,
        mustChangePassword: true,
      });
      console.log('✅ Default admin created: admin / vriddhi@admin123');
    }

    // Auto-create default settings if none exist
    const Settings = require('./src/models/Settings');
    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      await Settings.create({});
      console.log('✅ Default settings created');
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
