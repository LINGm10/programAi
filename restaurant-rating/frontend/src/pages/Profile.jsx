import React from 'react';
import { Navigate } from 'react-router-dom';
import { Card, Tabs } from 'antd';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return (
    <div style={{ maxWidth: 800, margin: '40px auto' }}>
      <Card>
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <Tabs items={[
          { key: 'reviews', label: '我的评价', children: <div>评价列表（待实现）</div> },
          { key: 'favorites', label: '我的收藏', children: <div>收藏列表（待实现）</div> },
        ]} />
      </Card>
    </div>
  );
};

export default Profile;
