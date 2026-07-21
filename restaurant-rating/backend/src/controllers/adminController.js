const { Review, Restaurant, User, ReviewImage } = require('../models');

exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: Restaurant, attributes: ['id', 'name'] },
        { model: ReviewImage },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ error: '获取评价失败' });
  }
};

exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['created_at', 'DESC']],
    });
    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取餐厅失败' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'avatar', 'created_at'],
      order: [['created_at', 'DESC']],
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: '获取用户失败' });
  }
};
