import React from 'react';
import { Card, Tag, Space } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link to={`/restaurants/${restaurant.id}`}>
      <Card hoverable style={{ marginBottom: 16 }}>
        <h3>{restaurant.name}</h3>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <StarRating value={restaurant.avg_total} />
          <span style={{ color: '#666' }}>
            口味 {restaurant.avg_taste} | 环境 {restaurant.avg_env} | 服务 {restaurant.avg_service}
          </span>
          <span style={{ color: '#999' }}>
            <EnvironmentOutlined /> {restaurant.address}
          </span>
          <Tag color="blue">{restaurant.category}</Tag>
          <span style={{ color: '#999', fontSize: 12 }}>
            {restaurant.review_count} 条评价
          </span>
        </Space>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
