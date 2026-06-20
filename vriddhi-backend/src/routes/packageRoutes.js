const router = require('express').Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/packageController');

router.get('/', ctrl.getAllPackages);
router.get('/admin/all', auth, ctrl.getAllPackagesAdmin);
router.get('/:id', ctrl.getPackageById);
router.post('/', auth, ctrl.createPackage);
router.put('/:id', auth, ctrl.updatePackage);
router.delete('/:id', auth, ctrl.deletePackage);

module.exports = router;
