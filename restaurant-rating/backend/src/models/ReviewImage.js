const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ReviewImage = sequelize.define('ReviewImage', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  review_id: { type: DataTypes.INTEGER, allowNull: false },
  image_path: { type: DataTypes.STRING(255), allowNull: false },
  sort_order: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'review_images' });

module.exports = ReviewImage;
