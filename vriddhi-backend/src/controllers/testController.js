const Test = require('../models/Test');
const Settings = require('../models/Settings');

exports.getAllTests = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 24, featured } = req.query;
    const query = { isActive: true };

    if (search) {
      query.$or = [
        { testName: { $regex: search, $options: 'i' } },
        { testCode: { $regex: search, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') query.category = category;
    if (featured === 'true') query.isFeatured = true;

    const total = await Test.countDocuments(query);
    const tests = await Test.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ testName: 1 });

    const settings = await Settings.findOne();
    const discount = settings?.globalDiscountPercent ?? 30;

    const testsWithPrice = tests.map((t) => {
      const obj = t.toObject();
      obj.effectiveOfferPrice =
        t.offerPrice != null ? t.offerPrice : Math.round(t.mrp * (1 - discount / 100));
      return obj;
    });

    res.json({
      success: true,
      data: testsWithPrice,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

exports.getTestById = async (req, res, next) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    next(err);
  }
};

exports.createTest = async (req, res, next) => {
  try {
    const test = await Test.create(req.body);
    res.status(201).json({ success: true, data: test });
  } catch (err) {
    next(err);
  }
};

exports.updateTest = async (req, res, next) => {
  try {
    const test = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!test) return res.status(404).json({ success: false, message: 'Test not found' });
    res.json({ success: true, data: test });
  } catch (err) {
    next(err);
  }
};

exports.deleteTest = async (req, res, next) => {
  try {
    await Test.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Test deleted successfully' });
  } catch (err) {
    next(err);
  }
};
