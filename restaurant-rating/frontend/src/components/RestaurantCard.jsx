import React from 'react';
import { Card, Tag, Space } from 'antd';
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const RestaurantCard = ({ restaurant }) => {
  const formatDistance = (distance) => {
    if (!distance) return '';
    const d = parseFloat(distance);
    if (d >= 1000) return `${(d/1000).toFixed(1)}km`;
    return `${Math.round(d)}m`;
  };

  return (
    <Link to={`/restaurants/${restaurant.amap_id || restaurant.id}`}>
      <Card hoverable style={{ marginBottom: 16, height: '100%' }}>
        <h3 style={{ marginBottom: 8 }}>{restaurant.name}</h3>
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <StarRating value={restaurant.avg_total} />
          <span style={{ color: '#666', fontSize: 13 }}>
            口味 {restaurant.avg_taste || '-'} | 环境 {restaurant.avg_env || '-'} | 服务 {restaurant.avg_service || '-'}
          </span>
          <span style={{ color: '#999', fontSize: 13 }}>
            <EnvironmentOutlined /> {restaurant.address}
          </span>
          {restaurant.phone && (
            <span style={{ color: '#999', fontSize: 13 }}>
              <PhoneOutlined /> {restaurant.phone}
            </span>
          )}
          <div>
            <Tag color="blue" style={{ margin: 0 }}>{restaurant.category}</Tag>
            {restaurant.distance && (
              <Tag color="green" style={{ margin: '0 0 0 8px' }}>
                {formatDistance(restaurant.distance)}
              </Tag>
            )}
          </div>
          <span style={{ color: '#999', fontSize: 12 }}>
            {restaurant.review_count || 0} 条评价
          </span>
        </Space>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
