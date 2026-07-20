const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  restaurant_id: { type: DataTypes.INTEGER, allowNull: false },
  taste_score: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  env_score: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  service_score: { type: DataTypes.TINYINT, allowNull: false, validate: { min: 1, max: 5 } },
  content: { type: DataTypes.TEXT },
  total_score: { type: DataTypes.DECIMAL(3, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'approved' },
}, {
  tableName: 'reviews',
  indexes: [
    { fields: ['restaurant_id', 'status'] },
  ],
});

module.exports = Review;
