const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const { authenticate } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/authController');

router.post('/login', ctrl.login);
router.post('/register', ctrl.register);
router.get('/me', authenticate, ctrl.getMe);
router.put('/profile', authenticate, ctrl.updateProfile);
router.post('/change-password', auth, ctrl.changePassword);

module.exports = router;
