import api from './api';

export const searchRestaurants = (params) => api.get('/restaurants/search', { params });
export const getRestaurant = (id) => api.get(`/restaurants/${id}`);
export const getNearby = (params) => api.get('/restaurants/nearby', { params });
export const syncFromAmap = (data) => api.post('/restaurants/sync-amap', data);
export const createRestaurant = (data) => api.post('/restaurants', data);

// 实时搜索（调用高德API）
export const searchRestaurantsRealtime = (params) => api.get('/restaurants/search', {
  params: { ...params, realtime: 'true' },
});
