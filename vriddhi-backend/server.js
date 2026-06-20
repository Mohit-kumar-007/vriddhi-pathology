require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5000;

const connectAndSeedDB = async () => {
  try {
    console.log('Connecting to primary MongoDB URI...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.warn('⚠️ Primary MongoDB connection failed:', err.message);
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      console.log('🌱 Starting in-memory MongoDB server as fallback...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log('🔑 In-memory MongoDB URI:', uri);
        await mongoose.connect(uri);
        console.log('✅ Connected to in-memory MongoDB');
      } catch (memErr) {
        console.error('❌ Failed to start in-memory MongoDB:', memErr);
        process.exit(1);
      }
    } else {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    }
  }

  try {
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

    // Auto-create default tests if none exist
    const Test = require('./src/models/Test');
    const testCount = await Test.countDocuments();
    if (testCount === 0) {
      console.log('🌱 No tests found. Seeding tests automatically...');
      const seedTests = require('./src/seed/seedTests');
      await seedTests(false); // pass false so it doesn't disconnect
    }

    // Auto-create default packages if none exist
    const Package = require('./src/models/Package');
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      console.log('🌱 No packages found. Seeding packages automatically...');
      const seedPackages = require('./src/seed/seedPackages');
      await seedPackages(false); // pass false so it doesn't disconnect
    }

    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (seedErr) {
    console.error('❌ Database initialization error:', seedErr);
    process.exit(1);
  }
};

connectAndSeedDB();
