const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

router.post('/:restaurantId', auth, favoriteController.add);
router.delete('/:restaurantId', auth, favoriteController.remove);
router.get('/', auth, favoriteController.list);

module.exports = router;
