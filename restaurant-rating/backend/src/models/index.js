const sequelize = require('../config/database');
const User = require('./User');
const Restaurant = require('./Restaurant');
const Review = require('./Review');
const ReviewImage = require('./ReviewImage');
const Favorite = require('./Favorite');
const Category = require('./Category');

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Restaurant.hasMany(Review, { foreignKey: 'restaurant_id' });
Review.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

Review.hasMany(ReviewImage, { foreignKey: 'review_id' });
ReviewImage.belongsTo(Review, { foreignKey: 'review_id' });

User.hasMany(Favorite, { foreignKey: 'user_id' });
Favorite.belongsTo(User, { foreignKey: 'user_id' });

Restaurant.hasMany(Favorite, { foreignKey: 'restaurant_id' });
Favorite.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });

Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Review,
  ReviewImage,
  Favorite,
  Category,
};
