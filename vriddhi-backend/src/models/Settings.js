const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    globalDiscountPercent: { type: Number, default: 30 },
    seniorCitizenExtraDiscount: { type: Number, default: 10 },
    familyDiscountPercent: { type: Number, default: 10 },
    freeHomeCollection: { type: Boolean, default: true },
    offerBannerText: {
      type: String,
      default:
        '30% OFF on All Tests | 10% Extra for Senior Citizens (60+) | Free Home Collection* | Family Discount: 10% off for 3+ members',
    },
    labTimings: { type: String, default: '9:00 AM – 8:00 PM, 7 Days a Week' },
    labPhone: { type: String, default: '9026578856' },
    labEmail: { type: String, default: 'vriddhipathology@gmail.com' },
    labAddress: {
      type: String,
      default: 'Jagdish Saray, Chandauli 232104, Uttar Pradesh',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
