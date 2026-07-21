const { Favorite, Restaurant } = require('../models');

exports.add = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const existing = await Favorite.findOne({
      where: { user_id: req.user.id, restaurant_id: restaurantId },
    });
    if (existing) {
      return res.status(400).json({ error: '已经收藏过了' });
    }

    await Favorite.create({
      user_id: req.user.id,
      restaurant_id: restaurantId,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '收藏失败' });
  }
};

exports.remove = async (req, res) => {
  try {
    await Favorite.destroy({
      where: { user_id: req.user.id, restaurant_id: req.params.restaurantId },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '取消收藏失败' });
  }
};

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const { count, rows } = await Favorite.findAndCountAll({
      where: { user_id: req.user.id },
      include: [{ model: Restaurant }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ favorites: rows, total: count, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: '获取收藏失败' });
  }
};
