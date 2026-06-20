const Admin = require('../models/Admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username/phone and password required' });
    }

    // Try finding admin first if username is 'admin'
    if (username.toLowerCase() === 'admin') {
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const match = await bcrypt.compare(password, admin.passwordHash);
      if (!match) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: admin._id, username: admin.username, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        mustChangePassword: admin.mustChangePassword,
        user: {
          id: admin._id,
          username: admin.username,
          role: 'admin'
        }
      });
    }

    // Otherwise, treat username as phone number and log in as normal user
    const user = await User.findOne({ phone: username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, phone: user.phone, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
        pincode: user.pincode,
        role: 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, phone, password, email, age, gender, address, pincode } = req.body;
    
    if (!name || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Name, phone, and password are required' });
    }

    // Validate phone length
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid 10-digit phone number' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Phone number already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      phone,
      passwordHash,
      email: email || '',
      age: age ? parseInt(age) : undefined,
      gender: gender || undefined,
      address: address || '',
      pincode: pincode || ''
    });

    const token = jwt.sign(
      { id: newUser._id, phone: newUser.phone, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        email: newUser.email,
        age: newUser.age,
        gender: newUser.gender,
        address: newUser.address,
        pincode: newUser.pincode,
        role: 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found' });
      }
      return res.json({
        success: true,
        user: {
          id: admin._id,
          username: admin.username,
          role: 'admin'
        }
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
        pincode: user.pincode,
        role: 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ success: false, message: 'Only users can update their profiles' });
    }

    const { name, email, age, gender, address, pincode } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (email !== undefined) user.email = email;
    if (age !== undefined) user.age = age ? parseInt(age) : undefined;
    if (gender !== undefined) user.gender = gender;
    if (address !== undefined) user.address = address;
    if (pincode !== undefined) user.pincode = pincode;

    await user.save();

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        age: user.age,
        gender: user.gender,
        address: user.address,
        pincode: user.pincode,
        role: 'user'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    // req.admin.id corresponds to req.user.id in the new role system
    const adminId = req.admin?.id || req.user?.id;
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });

    const match = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10);
    admin.mustChangePassword = false;
    await admin.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
