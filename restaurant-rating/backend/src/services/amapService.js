const axios = require('axios');
const config = require('../config/amap');

const client = axios.create({
  baseURL: config.baseUrl,
  timeout: 10000,
});

// 地理编码：地址转坐标
exports.geocode = async (address, city) => {
  const response = await client.get('/geocode/geo', {
    params: {
      key: config.key,
      address,
      city: city || '',
    },
  });

  if (response.data.status !== '1' || !response.data.geocodes.length) {
    throw new Error('地址解析失败，请检查地址是否正确');
  }

  const location = response.data.geocodes[0].location.split(',');
  return {
    longitude: location[0],
    latitude: location[1],
    formattedAddress: response.data.geocodes[0].formatted_address,
  };
};

// 周边搜索餐厅
exports.searchNearby = async (params) => {
  const { longitude, latitude, keyword, radius = 3000, page = 1, pageSize = 20 } = params;

  const response = await client.get('/place/around', {
    params: {
      key: config.key,
      keywords: keyword || '餐厅',
      location: `${longitude},${latitude}`,
      radius,
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
      distance: poi.distance,
    })),
    total: parseInt(response.data.count) || 0,
  };
};

// 文本搜索（按城市）
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

// 批量翻页搜索
exports.searchAllRestaurants = async (params) => {
  const { keyword, city, category, pageSize = 25 } = params;
  const allRestaurants = [];

  const firstPage = await exports.searchRestaurants({ keyword, city, category, page: 1, pageSize });
  allRestaurants.push(...firstPage.restaurants);

  const totalPages = Math.ceil(firstPage.total / pageSize);
  const maxPages = Math.min(totalPages, 40);

  for (let page = 2; page <= maxPages; page++) {
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
    phone: typeof poi.tel === 'string' ? poi.tel : (Array.isArray(poi.tel) ? poi.tel.join(',') : String(poi.tel || '')),
    category: poi.type,
    latitude: poi.location?.split(',')[1],
    longitude: poi.location?.split(',')[0],
    city: poi.cityname,
    district: poi.adname,
  };
};
