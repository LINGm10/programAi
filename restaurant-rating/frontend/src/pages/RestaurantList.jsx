import React, { useState, useEffect } from 'react';
import { Input, Row, Col, Pagination, Spin, Empty, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import AMap from '../components/AMap';
import { searchRestaurantsNearby } from '../services/restaurant';

const { Search } = Input;

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState(null);

  const address = searchParams.get('address') || '';
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    if (address) {
      loadRestaurants();
    }
  }, [address, keyword, page]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await searchRestaurantsNearby({ address, keyword, page, limit: 20 });
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
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={24}>
        <Col span={6}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>地址</label>
            <Search
              placeholder="输入地址（如：北京市朝阳区三里屯）"
              defaultValue={address}
              onSearch={handleSearch}
              enterButton="定位"
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 8 }}>搜索关键词</label>
            <Search
              placeholder="餐厅名称或类型（如：火锅）"
              defaultValue={keyword}
              onSearch={handleKeywordSearch}
            />
          </div>
          {location && (
            <div style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              <div style={{ fontSize: 12, color: '#666' }}>定位地址：</div>
              <div style={{ fontSize: 14 }}>{location.formattedAddress}</div>
            </div>
          )}
        </Col>

        <Col span={12}>
          <Spin spinning={loading}>
            {restaurants.length === 0 ? (
              <Empty description="请输入地址搜索周边餐厅" />
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

        <Col span={6}>
          <AMap markers={restaurants} center={location} />
        </Col>
      </Row>
    </div>
  );
};

export default RestaurantList;
