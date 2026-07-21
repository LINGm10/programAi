const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

router.post('/', auth, upload.array('images', 9), reviewController.create);
router.get('/:restaurantId', reviewController.getByRestaurant);
router.put('/:id', auth, reviewController.update);
router.delete('/:id', auth, reviewController.remove);
router.put('/:id/status', auth, admin, reviewController.updateStatus);

module.exports = router;
