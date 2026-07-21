const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/restaurants', require('./restaurants'));
router.use('/reviews', require('./reviews'));
router.use('/favorites', require('./favorites'));
router.use('/rankings', require('./rankings'));
router.use('/admin', require('./admin'));

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
