// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Button, Typography, Input, Form, notification } from 'antd';
import { UserOutlined, LockOutlined, KeyOutlined } from '@ant-design/icons'; // Import KeyOutlined
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const { Title, Paragraph } = Typography;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = await authService.login(values.email, values.password, values.tenant_key);
      login(data);
      navigate('/');
      notification.success({
        message: 'Login Successful!',
        description: 'You have successfully logged in.',
        duration: 3,
      });
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: error.response?.data?.message || 'Please check your credentials.',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen w-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-md p-8 w-full sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4 max-w-md">
        <Title level={2} className="mb-4 text-center">Login</Title>
        <Paragraph className="mb-4 text-center">Enter your email and password to log in.</Paragraph>
        <Form
          name="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          className="w-full"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          {/* New Form Item for Tenant Key */}
          <Form.Item
            name="tenant_key"
            rules={[{ required: true, message: 'Please enter your tenant key!' }]}
          >
            <Input
              prefix={<KeyOutlined className="site-form-item-icon" />}
              type="password" // Use type="password" as requested
              placeholder="Tenant Key"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
              Log In
            </Button>
          </Form.Item>
        </Form>

      </div>
    </div>
  );
}

export default LoginPage;