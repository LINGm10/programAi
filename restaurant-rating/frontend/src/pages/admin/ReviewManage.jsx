import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, message, Popconfirm, Space } from 'antd';
import api from '../../services/api';

const ReviewManage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { loadReviews(); }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await api.get('/admin/reviews');
      setReviews(data.reviews);
    } catch (error) {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/reviews/${id}/status`, { status });
      message.success('更新成功');
      loadReviews();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户', dataIndex: ['User', 'username'] },
    { title: '餐厅', dataIndex: ['Restaurant', 'name'] },
    { title: '评分', render: (_, r) => `${r.taste_score}/${r.env_score}/${r.service_score}` },
    { title: '内容', dataIndex: 'content', ellipsis: true },
    { title: '状态', dataIndex: 'status', render: (s) => (
      <Tag color={s === 'approved' ? 'green' : s === 'rejected' ? 'red' : 'orange'}>{s}</Tag>
    )},
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <Button size="small" type="primary" onClick={() => handleStatusChange(record.id, 'approved')}>通过</Button>
          <Button size="small" danger onClick={() => handleStatusChange(record.id, 'rejected')}>拒绝</Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={reviews} rowKey="id" loading={loading} />;
};

export default ReviewManage;
