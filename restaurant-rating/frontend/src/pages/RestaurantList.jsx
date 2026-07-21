import React, { useState, useEffect } from 'react';
import { Input, Select, Row, Col, Pagination, Spin, Empty, Switch, message } from 'antd';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import AMap from '../components/AMap';
import { searchRestaurantsRealtime } from '../services/restaurant';

const { Search } = Input;

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const keyword = searchParams.get('keyword') || '';
  const city = searchParams.get('city') || '';

  useEffect(() => {
    loadRestaurants();
  }, [keyword, city, page]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      const data = await searchRestaurantsRealtime({ keyword, city, page, limit: 10 });
      setRestaurants(data.restaurants);
      setTotal(data.total);
    } catch (error) {
      message.error('搜索失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchParams({ keyword: value, city });
    setPage(1);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Row gutter={24}>
        <Col span={6}>
          <div style={{ marginBottom: 16 }}>
            <Search placeholder="搜索餐厅" defaultValue={keyword} onSearch={handleSearch} />
          </div>
          <Select
            placeholder="选择城市"
            style={{ width: '100%', marginBottom: 16 }}
            value={city}
            onChange={(val) => setSearchParams({ keyword, city: val })}
            allowClear
            options={[
              { value: '北京', label: '北京' },
              { value: '上海', label: '上海' },
              { value: '广州', label: '广州' },
              { value: '深圳', label: '深圳' },
              { value: '成都', label: '成都' },
              { value: '杭州', label: '杭州' },
            ]}
          />
        </Col>

        <Col span={12}>
          <Spin spinning={loading}>
            {restaurants.length === 0 ? (
              <Empty description="暂无餐厅数据" />
            ) : (
              <>
                {restaurants.map((r) => (
                  <RestaurantCard key={r.amap_id || r.id} restaurant={r} />
                ))}
                <Pagination
                  current={page}
                  total={total}
                  pageSize={10}
                  onChange={setPage}
                  style={{ textAlign: 'center', marginTop: 24 }}
                />
              </>
            )}
          </Spin>
        </Col>

        <Col span={6}>
          <AMap markers={restaurants} />
        </Col>
      </Row>
    </div>
  );
};

export default RestaurantList;
