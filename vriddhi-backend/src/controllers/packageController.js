const Package = require('../models/Package');

exports.getAllPackages = async (req, res, next) => {
  try {
    const packages = await Package.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

exports.getAllPackagesAdmin = async (req, res, next) => {
  try {
    const packages = await Package.find().sort({ sortOrder: 1 });
    res.json({ success: true, data: packages });
  } catch (err) {
    next(err);
  }
};

exports.getPackageById = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

exports.createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

exports.deletePackage = async (req, res, next) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    next(err);
  }
};
