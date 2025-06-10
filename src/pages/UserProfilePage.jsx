// src/pages/UserProfilePage.jsx
import React from 'react';
import { Typography, Avatar, Descriptions } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

function UserProfilePage() {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    city: 'New York',
    country: 'USA',
  };

  return (
    <div className="p-4 md:p-6">
      <Title level={2}>User Profile</Title>
      <div className="flex items-center mb-4">
        <Avatar size={64} icon={<UserOutlined />} className="mr-4" />
        <Title level={4}>{user.name}</Title>
      </div>
      <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="City">{user.city}</Descriptions.Item>
        <Descriptions.Item label="Country">{user.country}</Descriptions.Item>
      </Descriptions>
      <div className="mt-8">
        <Paragraph>
          This is the user profile page. You can display user-specific information using Ant Design's Descriptions component and style the layout with Tailwind CSS.
        </Paragraph>
      </div>
    </div>
  );
}

export default UserProfilePage;