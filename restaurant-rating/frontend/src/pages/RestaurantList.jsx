import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Pagination, Spin, Empty, message, Slider, Tag } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { EnvironmentOutlined } from '@ant-design/icons';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurantsNearby } from '../services/restaurant';

const { Search } = Input;

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5000);

  const address = searchParams.get('address') || '';
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    if (address) {
      loadRestaurants();
    }
  }, [address, keyword, page, radius]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await searchRestaurantsNearby({ address, keyword, page, limit: 50, radius });
      setRestaurants(data.restaurants);
      setTotal(data.total);
      setLocation(data.location);
    } catch (error) {
      message.error(error.response?.data?.error || '搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ address: value, keyword });
    setPage(1);
  };

  const handleKeywordSearch = (value) => {
    setSearchParams({ address, keyword: value });
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
      {/* 搜索栏 - 全宽 */}
      <div style={{ marginBottom: 24, padding: 20, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Row gutter={16} align="middle">
          <Col span={10}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>地址</label>
            <Search
              placeholder="输入地址（如：北京市朝阳区三里屯）"
              defaultValue={address}
              onSearch={handleSearch}
              enterButton="定位"
              size="large"
            />
          </Col>
          <Col span={8}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>搜索关键词</label>
            <Search
              placeholder="餐厅名称或类型（如：火锅、咖啡、日料）"
              defaultValue={keyword}
              onSearch={handleKeywordSearch}
              size="large"
            />
          </Col>
          <Col span={6}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>搜索半径：{radius >= 1000 ? `${radius/1000}km` : `${radius}m`}</label>
            <Slider
              min={500}
              max={10000}
              step={500}
              value={radius}
              onChange={setRadius}
              marks={{
                500: '500m',
                1000: '1km',
                3000: '3km',
                5000: '5km',
                10000: '10km',
              }}
            />
          </Col>
        </Row>
        {location && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: '#f0f5ff', borderRadius: 4, display: 'inline-block' }}>
            <EnvironmentOutlined style={{ color: '#1890ff', marginRight: 8 }} />
            <span style={{ color: '#666' }}>定位：</span>
            <span style={{ fontWeight: 500 }}>{location.formattedAddress}</span>
            <span style={{ marginLeft: 16, color: '#666' }}>共找到 <strong style={{ color: '#1890ff' }}>{total}</strong> 家餐厅</span>
          </div>
        )}
      </div>

      {/* 餐厅列表 - 全宽 */}
      <Spin spinning={loading}>
        {restaurants.length === 0 ? (
          <Empty description="请输入地址搜索周边餐厅" style={{ marginTop: 100 }} />
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {restaurants.map((r) => (
                <Col key={r.amap_id} xs={24} sm={12} md={8} lg={6}>
                  <div style={{ position: 'relative' }}>
                    <RestaurantCard restaurant={r} />
                    {r.distance && (
                      <Tag color="blue" style={{ position: 'absolute', top: 8, right: 8, margin: 0 }}>
                        {r.distance >= 1000 ? `${(r.distance/1000).toFixed(1)}km` : `${r.distance}m`}
                      </Tag>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
            <Pagination
              current={page}
              total={total}
              pageSize={50}
              onChange={setPage}
              style={{ textAlign: 'center', marginTop: 24 }}
            />
          </>
        )}
      </Spin>
    </div>
  );
};

export default RestaurantList;
