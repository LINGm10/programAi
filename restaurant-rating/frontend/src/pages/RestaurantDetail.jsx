import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Row, Col, Rate, Tag, List, Avatar, Spin, Form, Input, Button, Upload, message } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { getRestaurant } from '../services/restaurant';
import { createReview } from '../services/review';
import { useAuth } from '../context/AuthContext';
import AMap from '../components/AMap';
import StarRating from '../components/StarRating';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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

  const handleSubmitReview = async (values) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('restaurant_id', id);
      formData.append('taste_score', values.taste_score);
      formData.append('env_score', values.env_score);
      formData.append('service_score', values.service_score);
      formData.append('content', values.content || '');

      if (values.images && values.images.fileList) {
        values.images.fileList.forEach((file) => {
          if (file.originFileObj) {
            formData.append('images', file.originFileObj);
          }
        });
      }

      await createReview(formData);
      message.success('评价成功');
      form.resetFields();
      loadDetail();
    } catch (error) {
      message.error(error.response?.data?.error || '评价失败');
    } finally {
      setSubmitting(false);
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

      {user && (
        <Card title="发表评价" style={{ marginTop: 16 }}>
          <Form form={form} onFinish={handleSubmitReview} layout="vertical">
            <Form.Item label="口味" name="taste_score" rules={[{ required: true, message: '请评分' }]}>
              <Rate />
            </Form.Item>
            <Form.Item label="环境" name="env_score" rules={[{ required: true, message: '请评分' }]}>
              <Rate />
            </Form.Item>
            <Form.Item label="服务" name="service_score" rules={[{ required: true, message: '请评分' }]}>
              <Rate />
            </Form.Item>
            <Form.Item label="评价内容" name="content">
              <Input.TextArea rows={4} placeholder="分享你的用餐体验..." />
            </Form.Item>
            <Form.Item label="上传图片" name="images">
              <Upload listType="picture-card" beforeUpload={() => false} maxCount={9}>
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交评价
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

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
