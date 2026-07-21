import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Pagination, Spin, Empty, message, Select, Slider } from 'antd';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import AMap from '../components/AMap';
import { searchRestaurantsNearby } from '../services/restaurant';

const { Search } = Input;
const { Option } = Select;

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(3000);

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
      const data = await searchRestaurantsNearby({ address, keyword, page, limit: 20, radius });
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
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>搜索半径：{radius}米</label>
            <Slider
              min={500}
              max={5000}
              step={500}
              value={radius}
              onChange={setRadius}
              marks={{
                500: '500m',
                1000: '1km',
                2000: '2km',
                3000: '3km',
                5000: '5km',
              }}
            />
          </Col>
        </Row>
      </div>

      <Row gutter={24}>
        <Col span={16}>
          <Spin spinning={loading}>
            {restaurants.length === 0 ? (
              <Empty description="请输入地址搜索周边餐厅" style={{ marginTop: 100 }} />
            ) : (
              <>
                {restaurants.map((r) => (
                  <RestaurantCard key={r.amap_id} restaurant={r} />
                ))}
                <Pagination
                  current={page}
                  total={total}
                  pageSize={20}
                  onChange={setPage}
                  style={{ textAlign: 'center', marginTop: 24 }}
                />
              </>
            )}
          </Spin>
        </Col>

        <Col span={8}>
          {location && (
            <div style={{ position: 'sticky', top: 24 }}>
              <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 4, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: '#666' }}>定位地址：</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{location.formattedAddress}</div>
              </div>
              <AMap markers={restaurants} center={location} style={{ height: 600 }} />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default RestaurantList;
