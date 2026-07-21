import React, { useState } from 'react';
import { Button, Form, Input, message, Card } from 'antd';
import { syncFromAmap, createRestaurant } from '../../services/restaurant';

const RestaurantManage = () => {
  const [loading, setLoading] = useState(false);
  const [syncForm] = Form.useForm();
  const [createForm] = Form.useForm();

  const handleSync = async (values) => {
    setLoading(true);
    try {
      const data = await syncFromAmap(values);
      message.success(`同步成功，新增 ${data.synced} 家餐厅`);
      syncForm.resetFields();
    } catch (error) {
      message.error('同步失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (values) => {
    try {
      await createRestaurant(values);
      message.success('添加成功');
      createForm.resetFields();
    } catch (error) {
      message.error('添加失败');
    }
  };

  return (
    <div>
      <Card title="从高德同步餐厅" style={{ marginBottom: 24 }}>
        <Form form={syncForm} layout="inline" onFinish={handleSync}>
          <Form.Item name="city" rules={[{ required: true, message: '请输入城市' }]}>
            <Input placeholder="城市" />
          </Form.Item>
          <Form.Item name="keyword">
            <Input placeholder="关键词（如火锅）" />
          </Form.Item>
          <Form.Item name="category">
            <Input placeholder="分类" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>同步</Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title="手动添加餐厅">
        <Form form={createForm} layout="vertical" onFinish={handleCreate} style={{ maxWidth: 600 }}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input />
          </Form.Item>
          <Form.Item name="city" label="城市">
            <Input />
          </Form.Item>
          <Form.Item name="category" label="分类">
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="电话">
            <Input />
          </Form.Item>
          <Form.Item name="latitude" label="纬度">
            <Input type="number" step="0.0000001" />
          </Form.Item>
          <Form.Item name="longitude" label="经度">
            <Input type="number" step="0.0000001" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">添加</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RestaurantManage;
