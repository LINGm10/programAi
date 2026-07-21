import React, { useState, useEffect } from 'react';
import { Input, Select, Button, Row, Col, List, Tabs, Card, Typography } from 'antd';
import { SearchOutlined, TrophyOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurants } from '../services/restaurant';
import { getTopRated, getMostReviewed, getTrending } from '../services/ranking';

const { Search } = Input;
const { Title } = Typography;

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [rankings, setRankings] = useState({ topRated: [], mostReviewed: [], trending: [] });
  const navigate = useNavigate();

  useEffect(() => {
    loadRestaurants();
    loadRankings();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await searchRestaurants({ limit: 6 });
      setRestaurants(data.restaurants);
    } catch (error) {
      console.error('加载失败', error);
    }
  };

  const loadRankings = async () => {
    try {
      const [topRated, mostReviewed, trending] = await Promise.all([
        getTopRated({ limit: 5 }),
        getMostReviewed({ limit: 5 }),
        getTrending({ limit: 5 }),
      ]);
      setRankings({
        topRated: topRated.restaurants || [],
        mostReviewed: mostReviewed.restaurants || [],
        trending: trending.restaurants || [],
      });
    } catch (error) {
      console.error('加载排行榜失败', error);
    }
  };

  const handleSearch = () => {
    navigate(`/restaurants?keyword=${keyword}&city=${city}`);
  };

  const RankingList = ({ data }) => (
    <List
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <span style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: index < 3 ? '#fa8c16' : '#999',
              width: 30,
            }}>
              {index + 1}
            </span>
            <div style={{ flex: 1 }}>
              <a href={`/restaurants/${item.id}`} style={{ fontWeight: 500 }}>{item.name}</a>
              <span style={{ color: '#999', marginLeft: 8 }}>{item.district}</span>
            </div>
            <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>{item.avg_total}</span>
          </div>
        </List.Item>
      )}
    />
  );

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={1}>发现美食</Title>
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

      <Card title={<span><TrophyOutlined /> 排行榜</span>} style={{ marginBottom: 24 }}>
        <Tabs
          items={[
            {
              key: 'top',
              label: <span><StarOutlined /> 评分最高</span>,
              children: <RankingList data={rankings.topRated} />,
            },
            {
              key: 'reviewed',
              label: <span>评价最多</span>,
              children: <RankingList data={rankings.mostReviewed} />,
            },
            {
              key: 'trending',
              label: <span><FireOutlined /> 近期热门</span>,
              children: <RankingList data={rankings.trending} />,
            },
          ]}
        />
      </Card>

      <Title level={3}>推荐餐厅</Title>
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
