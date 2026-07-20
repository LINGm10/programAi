const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  parent_id: { type: DataTypes.INTEGER, allowNull: true },
  icon: { type: DataTypes.STRING(50) },
}, { tableName: 'categories' });

module.exports = Category;
