import React, { useState, useEffect, useRef } from 'react';
import { Input, Row, Col, Pagination, Spin, Empty, message, Slider, Tag, List, Typography } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurantsNearby, getAddressSuggestions } from '../services/restaurant';

const { Search } = Input;
const { Text } = Typography;

const RestaurantList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(5000);
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const suggestTimer = useRef(null);

  const address = searchParams.get('address') || '';
  const keyword = searchParams.get('keyword') || '';

  useEffect(() => {
    if (address) {
      setAddressInput(address);
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

  // 地址输入变化时获取建议
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddressInput(value);

    if (suggestTimer.current) clearTimeout(suggestTimer.current);

    if (value.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSuggestLoading(true);
    suggestTimer.current = setTimeout(async () => {
      try {
        const data = await getAddressSuggestions(value);
        setSuggestions(data.tips || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error('获取地址建议失败', error);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
  };

  // 选择地址建议
  const handleSelectSuggestion = (tip) => {
    const fullAddress = tip.district ? `${tip.district}${tip.name}` : tip.name;
    setAddressInput(fullAddress);
    setShowSuggestions(false);
    setSearchParams({ address: fullAddress, keyword });
    setPage(1);
  };

  const handleSearch = (value) => {
    setShowSuggestions(false);
    setSearchParams({ address: value || addressInput, keyword });
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
          <Col span={10} style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>地址</label>
            <div style={{ position: 'relative' }}>
              <Input
                placeholder="输入地址（如：三里屯、中关村）"
                value={addressInput}
                onChange={handleAddressChange}
                onPressEnter={() => handleSearch(addressInput)}
                size="large"
                prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                suffix={suggestLoading ? <Spin size="small" /> : null}
              />
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  maxHeight: 300,
                  overflow: 'auto',
                  marginTop: 4,
                }}>
                  <List
                    size="small"
                    dataSource={suggestions}
                    renderItem={(tip) => (
                      <List.Item
                        onClick={() => handleSelectSuggestion(tip)}
                        style={{
                          cursor: 'pointer',
                          padding: '8px 12px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div>
                          <Text strong>{tip.name}</Text>
                          {tip.address && <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{tip.address}</Text>}
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              )}
            </div>
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
