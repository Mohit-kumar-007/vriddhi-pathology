const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/testController');

router.get('/', ctrl.getAllTests);
router.get('/:id', ctrl.getTestById);
router.post('/', auth, ctrl.createTest);
router.put('/:id', auth, ctrl.updateTest);
router.delete('/:id', auth, ctrl.deleteTest);

module.exports = router;
