const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/notificationController');

router.get('/', ctrl.getNotifications);
router.get('/admin/all', auth, ctrl.getAllNotificationsAdmin);
router.post('/', auth, ctrl.createNotification);
router.put('/:id', auth, ctrl.updateNotification);
router.delete('/:id', auth, ctrl.deleteNotification);

module.exports = router;
