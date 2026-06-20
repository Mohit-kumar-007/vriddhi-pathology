const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

exports.getAllNotificationsAdmin = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

exports.createNotification = async (req, res, next) => {
  try {
    const n = await Notification.create(req.body);
    res.status(201).json({ success: true, data: n });
  } catch (err) {
    next(err);
  }
};

exports.updateNotification = async (req, res, next) => {
  try {
    const n = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!n) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: n });
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};
