const { Op } = require('sequelize');
const { Restaurant, Review, User, ReviewImage } = require('../models');
const amapService = require('../services/amapService');

exports.search = async (req, res) => {
  try {
    const { keyword, city, category, page = 1, limit = 20 } = req.query;
    const where = {};

    if (keyword) where.name = { [Op.like]: `%${keyword}%` };
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (category) where.category = { [Op.like]: `%${category}%` };

    const { count, rows } = await Restaurant.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['avg_total', 'DESC']],
    });

    res.json({ restaurants: rows, total: count, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ error: '搜索失败' });
  }
};

// 地址输入提示/自动补全
exports.addressSuggest = async (req, res) => {
  try {
    const { keyword, city } = req.query;
    if (!keyword || keyword.length < 1) {
      return res.json({ tips: [] });
    }
    const tips = await amapService.inputTips(keyword, city);
    res.json({ tips });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 通过地址搜索周边餐厅
exports.searchNearby = async (req, res) => {
  try {
    const { address, city, keyword, radius, page = 1, limit = 100 } = req.query;

    if (!address) {
      return res.status(400).json({ error: '请输入地址' });
    }

    // 1. 地理编码：地址转坐标
    const geoResult = await amapService.geocode(address, city);

    // 2. 周边搜索餐厅（自动翻页获取所有结果）
    const result = await amapService.searchNearby({
      longitude: geoResult.longitude,
      latitude: geoResult.latitude,
      keyword,
      radius: radius ? parseInt(radius) : 5000,
      page: parseInt(page),
      pageSize: 25,
    });

    // 3. 按距离排序
    const sortedRestaurants = result.restaurants.sort((a, b) => {
      const distA = parseFloat(a.distance) || 99999;
      const distB = parseFloat(b.distance) || 99999;
      return distA - distB;
    });

    // 4. 分页返回
    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    const paginatedRestaurants = sortedRestaurants.slice(startIndex, endIndex);

    res.json({
      restaurants: paginatedRestaurants,
      total: result.total,
      page: parseInt(page),
      location: {
        longitude: geoResult.longitude,
        latitude: geoResult.latitude,
        formattedAddress: geoResult.formattedAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [{
        model: Review,
        where: { status: 'approved' },
        required: false,
        include: [
          { model: User, attributes: ['id', 'username', 'avatar'] },
          { model: ReviewImage },
        ],
        order: [['created_at', 'DESC']],
      }],
    });

    if (!restaurant) {
      return res.status(404).json({ error: '餐厅不存在' });
    }

    res.json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: '获取详情失败' });
  }
};

exports.syncFromAmap = async (req, res) => {
  try {
    const { city, keyword, category } = req.body;
    const result = await amapService.searchAllRestaurants({ keyword, city, category });

    let synced = 0;
    for (const poi of result.restaurants) {
      const [restaurant, created] = await Restaurant.findOrCreate({
        where: { amap_id: poi.amap_id },
        defaults: poi,
      });
      if (created) synced++;
    }

    res.json({ synced, total: result.total });
  } catch (error) {
    res.status(500).json({ error: '同步失败: ' + error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const restaurant = await Restaurant.create({
      ...req.body,
      source: 'manual',
    });
    res.status(201).json({ restaurant });
  } catch (error) {
    res.status(500).json({ error: '添加失败' });
  }
};

exports.getNearby = async (req, res) => {
  try {
    const { latitude, longitude, radius = 3 } = req.query;

    const restaurants = await Restaurant.findAll({
      where: {
        latitude: { [Op.between]: [latitude - radius * 0.01, latitude + radius * 0.01] },
        longitude: { [Op.between]: [longitude - radius * 0.01, longitude + radius * 0.01] },
      },
      limit: 20,
      order: [['avg_total', 'DESC']],
    });

    res.json({ restaurants });
  } catch (error) {
    res.status(500).json({ error: '获取附近餐厅失败' });
  }
};
