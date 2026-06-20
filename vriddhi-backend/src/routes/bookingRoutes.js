const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bookingController');

// Public
router.post('/', ctrl.createBooking);

// User/Patient Bookings
router.get('/my-bookings', authenticate, ctrl.getUserBookings);

// Admin only - specific routes before :id
router.get('/export/csv', auth, ctrl.exportBookingsCSV);
router.get('/dashboard/stats', auth, ctrl.getDashboardStats);
router.get('/', auth, ctrl.getAllBookings);
router.get('/:id', auth, ctrl.getBookingById);
router.put('/:id/status', auth, ctrl.updateBookingStatus);
router.delete('/:id', auth, ctrl.deleteBooking);

module.exports = router;
