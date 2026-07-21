const axios = require('axios');
const config = require('../config/amap');

const client = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
});

exports.searchRestaurants = async (params) => {
  const { keyword, city, category, page = 1, pageSize = 20 } = params;

  const response = await client.get('/place/text', {
    params: {
      key: config.key,
      keywords: keyword || '餐厅',
      city: city || '',
      types: category || '',
      offset: pageSize,
      page,
      extensions: 'all',
    },
  });

  if (response.data.status !== '1') {
    throw new Error(response.data.info || '高德API调用失败');
  }

  return {
    restaurants: response.data.pois.map((poi) => ({
      amap_id: poi.id,
      name: poi.name,
      address: poi.address,
      phone: typeof poi.tel === 'string' ? poi.tel : (Array.isArray(poi.tel) ? poi.tel.join(',') : String(poi.tel || '')),
      category: poi.type,
      latitude: poi.location?.split(',')[1],
      longitude: poi.location?.split(',')[0],
      city: poi.cityname,
      district: poi.adname,
    })),
    total: parseInt(response.data.count) || 0,
  };
};

exports.searchAllRestaurants = async (params) => {
  const { keyword, city, category, pageSize = 25 } = params;
  const allRestaurants = [];

  // 获取第一页，确定总数
  const firstPage = await exports.searchRestaurants({ keyword, city, category, page: 1, pageSize });
  allRestaurants.push(...firstPage.restaurants);

  const totalPages = Math.ceil(firstPage.total / pageSize);
  const maxPages = Math.min(totalPages, 40); // 高德API最多返回1000条

  // 逐页获取剩余数据
  for (let page = 2; page <= maxPages; page++) {
    // 添加延迟避免频率限制
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await exports.searchRestaurants({ keyword, city, category, page, pageSize });
    allRestaurants.push(...result.restaurants);
    if (result.restaurants.length === 0) break;
  }

  return {
    restaurants: allRestaurants,
    total: allRestaurants.length,
  };
};

exports.getRestaurantDetail = async (amapId) => {
  const response = await client.get('/place/detail', {
    params: {
      key: config.key,
      id: amapId,
      extensions: 'all',
    },
  });

  if (response.data.status !== '1' || !response.data.pois.length) {
    throw new Error('餐厅信息获取失败');
  }

  const poi = response.data.pois[0];
  return {
    amap_id: poi.id,
    name: poi.name,
    address: poi.address,
    phone: poi.tel,
    category: poi.type,
    latitude: poi.location?.split(',')[1],
    longitude: poi.location?.split(',')[0],
    city: poi.cityname,
    district: poi.adname,
  };
};
