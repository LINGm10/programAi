const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/search', restaurantController.search);
router.get('/nearby', restaurantController.getNearby);
router.get('/:id', restaurantController.getById);
router.post('/sync-amap', auth, admin, restaurantController.syncFromAmap);
router.post('/', auth, admin, restaurantController.create);

module.exports = router;
