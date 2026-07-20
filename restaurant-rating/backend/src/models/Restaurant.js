const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurant = sequelize.define('Restaurant', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amap_id: { type: DataTypes.STRING(50), unique: true, allowNull: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  address: { type: DataTypes.STRING(500) },
  phone: { type: DataTypes.STRING(50) },
  category: { type: DataTypes.STRING(100) },
  latitude: { type: DataTypes.DECIMAL(10, 7) },
  longitude: { type: DataTypes.DECIMAL(10, 7) },
  city: { type: DataTypes.STRING(50) },
  district: { type: DataTypes.STRING(50) },
  avg_taste: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  avg_env: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  avg_service: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  avg_total: { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
  review_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  image_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  source: { type: DataTypes.ENUM('amap', 'manual'), defaultValue: 'amap' },
}, {
  tableName: 'restaurants',
  indexes: [
    { fields: ['city'] },
    { fields: ['category'] },
    { fields: ['avg_total'] },
  ],
});

module.exports = Restaurant;
