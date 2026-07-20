import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Rate, Tag, List, Avatar, Spin } from 'antd';
import { EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { getRestaurant } from '../services/restaurant';
import AMap from '../components/AMap';
import StarRating from '../components/StarRating';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDetail();
  }, [id]);

  const loadDetail = async () => {
    setLoading(true);
    try {
      const data = await getRestaurant(id);
      setRestaurant(data.restaurant);
    } catch (error) {
      console.error('加载失败', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
  if (!restaurant) return <div>餐厅不存在</div>;

  return (
    <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 24px' }}>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <h1>{restaurant.name}</h1>
            <p><EnvironmentOutlined /> {restaurant.address}</p>
            {restaurant.phone && <p><PhoneOutlined /> {restaurant.phone}</p>}
            <Tag color="blue">{restaurant.category}</Tag>
            <Tag>{restaurant.district}</Tag>
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#fa8c16' }}>
              {restaurant.avg_total}
            </div>
            <StarRating value={restaurant.avg_total} />
            <p style={{ color: '#999' }}>{restaurant.review_count} 条评价</p>
          </Col>
        </Row>
      </Card>

      <Card title="评分详情" style={{ marginTop: 16 }}>
        <Row gutter={24}>
          <Col span={8}>口味 <Rate disabled value={parseFloat(restaurant.avg_taste)} allowHalf /></Col>
          <Col span={8}>环境 <Rate disabled value={parseFloat(restaurant.avg_env)} allowHalf /></Col>
          <Col span={8}>服务 <Rate disabled value={parseFloat(restaurant.avg_service)} allowHalf /></Col>
        </Row>
      </Card>

      <Card title="位置" style={{ marginTop: 16 }}>
        <AMap
          markers={[{ name: restaurant.name, latitude: restaurant.latitude, longitude: restaurant.longitude }]}
          center={{ latitude: restaurant.latitude, longitude: restaurant.longitude }}
          zoom={15}
          style={{ height: 300 }}
        />
      </Card>

      <Card title="评价" style={{ marginTop: 16 }}>
        <List
          dataSource={restaurant.Reviews || []}
          renderItem={(review) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar>{review.User?.username?.[0]}</Avatar>}
                title={
                  <div>
                    <span>{review.User?.username}</span>
                    <span style={{ marginLeft: 16 }}>
                      口味{review.taste_score} 环境{review.env_score} 服务{review.service_score}
                    </span>
                  </div>
                }
                description={
                  <div>
                    <p>{review.content}</p>
                    {review.ReviewImages?.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        {review.ReviewImages.map((img) => (
                          <img key={img.id} src={`/uploads/${img.image_path}`} alt="" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                        ))}
                      </div>
                    )}
                    <span style={{ color: '#999', fontSize: 12 }}>{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default RestaurantDetail;
