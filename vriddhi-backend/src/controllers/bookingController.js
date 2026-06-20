const Booking = require('../models/Booking');
const Settings = require('../models/Settings');
const Test = require('../models/Test');
const Notification = require('../models/Notification');
const generateBookingId = require('../utils/generateBookingId');
const generateWhatsAppLink = require('../utils/generateWhatsAppLink');
const exportBookingsCSV = require('../utils/csvExporter');
const jwt = require('jsonwebtoken');

exports.createBooking = async (req, res, next) => {
  try {
    const settings = await Settings.findOne();
    const labPhone = settings?.labPhone || '9026578856';
    const bookingId = await generateBookingId();
    const totalAmount = req.body.selectedTests.reduce(
      (sum, t) => sum + (t.offerPrice || 0),
      0
    );

    const bookingData = { ...req.body, bookingId, totalAmount };

    // Check if user is logged in to link booking to user profile
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded && decoded.role === 'user') {
          bookingData.userId = decoded.id;
        }
      } catch (err) {
        // ignore invalid token for booking creation
      }
    }

    const booking = await Booking.create(bookingData);

    const whatsappLink = generateWhatsAppLink(booking, labPhone);
    booking.whatsappLink = whatsappLink;
    await booking.save();

    res.status(201).json({ success: true, data: { booking, whatsappLink } });
  } catch (err) {
    next(err);
  }
};

exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, search, startDate, endDate, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { patientName: { $regex: search, $options: 'i' } },
        { phone: { $regex: search } },
        { bookingId: { $regex: search, $options: 'i' } },
      ];
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      data: bookings,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.updateBookingStatus = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.exportBookingsCSV = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    const csv = exportBookingsCSV(bookings);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=vriddhi_bookings.csv');
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todayCount, monthCount, pendingCount, testCount, notifCount] =
      await Promise.all([
        Booking.countDocuments({ createdAt: { $gte: today } }),
        Booking.countDocuments({ createdAt: { $gte: monthStart } }),
        Booking.countDocuments({ status: 'pending' }),
        Test.countDocuments({ isActive: true }),
        Notification.countDocuments({ isActive: true }),
      ]);

    res.json({
      success: true,
      data: { todayCount, monthCount, pendingCount, testCount, notifCount },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserBookings = async (req, res, next) => {
  try {
    if (req.user.role === 'admin') {
      const bookings = await Booking.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: bookings });
    }

    const bookings = await Booking.find({
      $or: [
        { userId: req.user.id },
        { phone: req.user.phone }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
};
