import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ padding: '16px 24px', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 'bold', color: '#1890ff' }}>
          餐厅评分
        </Link>
        <Space>
          <Link to="/restaurants">找餐厅</Link>
          {user ? (
            <>
              <Link to="/profile"><UserOutlined /> {user.username}</Link>
              <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/'); }}>退出</Button>
            </>
          ) : (
            <>
              <Link to="/login">登录</Link>
              <Link to="/register">注册</Link>
            </>
          )}
        </Space>
      </div>
    </header>
  );
};

export default Header;
