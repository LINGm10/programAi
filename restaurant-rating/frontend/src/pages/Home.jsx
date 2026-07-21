import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Row, Col, List, Tabs, Card, Typography, Spin } from 'antd';
import { SearchOutlined, TrophyOutlined, FireOutlined, StarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import { searchRestaurants, getAddressSuggestions } from '../services/restaurant';
import { getTopRated, getMostReviewed, getTrending } from '../services/ranking';

const { Search } = Input;
const { Title, Text } = Typography;

const Home = () => {
  const [keyword, setKeyword] = useState('');
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [rankings, setRankings] = useState({ topRated: [], mostReviewed: [], trending: [] });
  const navigate = useNavigate();
  const suggestTimer = useRef(null);

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

  // 地址输入变化时获取建议
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

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
    setAddress(fullAddress);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    setShowSuggestions(false);
    if (address) {
      navigate(`/restaurants?address=${encodeURIComponent(address)}&keyword=${encodeURIComponent(keyword)}`);
    } else if (keyword) {
      navigate(`/restaurants?keyword=${encodeURIComponent(keyword)}`);
    }
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
        <Row gutter={16} justify="center" style={{ maxWidth: 800, margin: '0 auto' }}>
          <Col span={10} style={{ position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <Input
                placeholder="输入地址（如：三里屯、中关村）"
                value={address}
                onChange={handleAddressChange}
                onPressEnter={handleSearch}
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
                  textAlign: 'left',
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
          <Col span={10}>
            <Search
              placeholder="餐厅名称或类型（如：火锅、咖啡）"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              size="large"
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={handleSearch} size="large" block>搜索</Button>
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
