const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');

router.get('/top-rated', rankingController.topRated);
router.get('/most-reviewed', rankingController.mostReviewed);
router.get('/trending', rankingController.trending);

module.exports = router;
