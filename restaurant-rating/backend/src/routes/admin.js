const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.use(auth, admin);

router.get('/reviews', adminController.getReviews);
router.get('/restaurants', adminController.getRestaurants);
router.get('/users', adminController.getUsers);

module.exports = router;
