import api from './api';

export const addFavorite = (restaurantId) => api.post(`/favorites/${restaurantId}`);
export const removeFavorite = (restaurantId) => api.delete(`/favorites/${restaurantId}`);
export const getFavorites = (params) => api.get('/favorites', { params });
