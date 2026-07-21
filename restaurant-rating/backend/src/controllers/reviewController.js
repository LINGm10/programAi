const { Review, ReviewImage, Restaurant, User } = require('../models');

exports.create = async (req, res) => {
  try {
    const { restaurant_id, taste_score, env_score, service_score, content } = req.body;

    const existing = await Review.findOne({
      where: { user_id: req.user.id, restaurant_id },
    });
    if (existing) {
      return res.status(400).json({ error: '你已经评价过这家餐厅' });
    }

    const total_score = (taste_score * 0.4 + env_score * 0.3 + service_score * 0.3).toFixed(2);

    const review = await Review.create({
      user_id: req.user.id,
      restaurant_id,
      taste_score,
      env_score,
      service_score,
      content,
      total_score,
    });

    if (req.files && req.files.length > 0) {
      const images = req.files.map((file, index) => ({
        review_id: review.id,
        image_path: file.filename,
        sort_order: index,
      }));
      await ReviewImage.bulkCreate(images);

      await Restaurant.increment('image_count', {
        where: { id: restaurant_id },
        by: req.files.length,
      });
    }

    await updateRestaurantScores(restaurant_id);

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ error: '发表评价失败' });
  }
};

exports.getByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, sort = 'latest' } = req.query;

    let order = [['created_at', 'DESC']];
    if (sort === 'highest') order = [['total_score', 'DESC']];
    if (sort === 'lowest') order = [['total_score', 'ASC']];

    const { count, rows } = await Review.findAndCountAll({
      where: { restaurant_id: restaurantId, status: 'approved' },
      include: [
        { model: User, attributes: ['id', 'username', 'avatar'] },
        { model: ReviewImage },
      ],
      order,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({ reviews: rows, total: count, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: '获取评价失败' });
  }
};

exports.update = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id, user_id: req.user.id },
    });

    if (!review) {
      return res.status(404).json({ error: '评价不存在' });
    }

    const { taste_score, env_score, service_score, content } = req.body;
    const total_score = (taste_score * 0.4 + env_score * 0.3 + service_score * 0.3).toFixed(2);

    await review.update({ taste_score, env_score, service_score, content, total_score });
    await updateRestaurantScores(review.restaurant_id);

    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: '更新评价失败' });
  }
};

exports.remove = async (req, res) => {
  try {
    const review = await Review.findOne({
      where: { id: req.params.id },
    });

    if (!review) {
      return res.status(404).json({ error: '评价不存在' });
    }

    if (review.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: '无权删除' });
    }

    await ReviewImage.destroy({ where: { review_id: review.id } });
    await review.destroy();
    await updateRestaurantScores(review.restaurant_id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: '删除评价失败' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ error: '评价不存在' });
    }

    await review.update({ status: req.body.status });
    await updateRestaurantScores(review.restaurant_id);

    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: '更新状态失败' });
  }
};

async function updateRestaurantScores(restaurantId) {
  const reviews = await Review.findAll({
    where: { restaurant_id: restaurantId, status: 'approved' },
  });

  if (reviews.length === 0) {
    await Restaurant.update({
      avg_taste: 0, avg_env: 0, avg_service: 0, avg_total: 0, review_count: 0,
    }, { where: { id: restaurantId } });
    return;
  }

  const sums = reviews.reduce((acc, r) => ({
    taste: acc.taste + parseFloat(r.taste_score),
    env: acc.env + parseFloat(r.env_score),
    service: acc.service + parseFloat(r.service_score),
    total: acc.total + parseFloat(r.total_score),
  }), { taste: 0, env: 0, service: 0, total: 0 });

  const count = reviews.length;
  await Restaurant.update({
    avg_taste: (sums.taste / count).toFixed(2),
    avg_env: (sums.env / count).toFixed(2),
    avg_service: (sums.service / count).toFixed(2),
    avg_total: (sums.total / count).toFixed(2),
    review_count: count,
  }, { where: { id: restaurantId } });
}
