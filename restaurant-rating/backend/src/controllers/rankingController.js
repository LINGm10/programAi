const { Op } = require('sequelize');
const { Restaurant, Review } = require('../models');

exports.topRated = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const where = { review_count: { [Op.gt]: 0 } };
    if (city) where.city = { [Op.like]: `%${city}%` };

    const restaurants = await Restaurant.findAll({
      where,
      order: [['avg_total', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' });
  }
};

exports.mostReviewed = async (req, res) => {
  try {
    const { city, limit = 10 } = req.query;
    const where = {};
    if (city) where.city = { [Op.like]: `%${city}%` };

    const restaurants = await Restaurant.findAll({
      where,
      order: [['review_count', 'DESC']],
      limit: parseInt(limit),
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' });
  }
};

exports.trending = async (req, res) => {
  try {
    const { city, limit = 10, days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const reviewWhere = { created_at: { [Op.gte]: since }, status: 'approved' };
    const restaurantWhere = {};
    if (city) restaurantWhere.city = { [Op.like]: `%${city}%` };

    const reviews = await Review.findAll({
      where: reviewWhere,
      attributes: ['restaurant_id'],
      group: ['restaurant_id'],
    });

    const restaurantIds = reviews.map((r) => r.restaurant_id);

    let restaurants = [];
    if (restaurantIds.length > 0) {
      restaurants = await Restaurant.findAll({
        where: {
          id: { [Op.in]: restaurantIds },
          ...restaurantWhere,
        },
        order: [['avg_total', 'DESC']],
        limit: parseInt(limit),
      });
    }

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取排行榜失败' });
  }
};
