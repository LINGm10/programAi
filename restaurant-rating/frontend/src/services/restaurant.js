import api from './api';

export const searchRestaurants = (params) => api.get('/restaurants/search', { params });
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);
export const getNearby = (params) => api.get('/restaurants/nearby', { params });
export const syncFromAmap = (data) => api.post('/restaurants/sync-amap', data);
export const createRestaurant = (data) => api.post('/restaurants', data);

// 地址定位搜索周边餐厅
export const searchRestaurantsNearby = (params) => api.get('/restaurants/nearby', { params });

// 地址自动补全建议
export const getAddressSuggestions = (keyword, city) => api.get('/restaurants/suggest', {
  params: { keyword, city },
});
