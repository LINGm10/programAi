import React, { useState, useEffect } from 'react';
import { Table, Tag } from 'antd';
import api from '../../services/api';

const UserManage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then((data) => setUsers(data.users)).catch(console.error);
  }, []);

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    { title: '角色', dataIndex: 'role', render: (r) => (
      <Tag color={r === 'admin' ? 'red' : 'blue'}>{r}</Tag>
    )},
    { title: '注册时间', dataIndex: 'created_at', render: (d) => new Date(d).toLocaleDateString() },
  ];

  return <Table columns={columns} dataSource={users} rowKey="id" />;
};

export default UserManage;
