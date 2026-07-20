import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Row, Col, List } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurants } from '../services/restaurant';

const { Search } = Input;

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await searchRestaurants({ limit: 10 });
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error('加载失败', error);
    }
  };

  const handleSearch = () => {
    navigate(`/restaurants?keyword=${keyword}&city=${city}`);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1>发现美食</h1>
        <Row gutter={16} justify="center" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Col span={8}>
            <Select
              placeholder="选择城市"
              style={{ width: '100%' }}
              value={city}
              onChange={setCity}
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
            <Search
              placeholder="搜索餐厅"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleSearch} block>搜索</Button>
          </Col>
        </Row>
      </div>

      <h2>推荐餐厅</h2>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={restaurants}
        renderItem={(item) => (
          <List.Item>
            <RestaurantCard restaurant={item} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default Home;
