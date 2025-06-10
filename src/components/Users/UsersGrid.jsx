import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import {
  Card,
  Button,
  Space,
  Popconfirm,
  Tag,
  Row,
  Col,
  Typography,
  Spin,
  Alert,
  Tooltip,
  Avatar,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  MailOutlined,
  CalendarOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text, Title } = Typography;

function getInitials(name) {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.toUpperCase();
}

function UsersGrid({ users, loading, error, onDeleteSuccess, onEditClick, onManageClick }) {
  const { hasPermission } = usePermissions();

  const canSeeActions = hasPermission("User Actions");

  if (loading) {
    return <Spin size="large" className="block text-center my-8" tip="Loading Users..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (users.length === 0) {
    return <Alert message="No users found." type="info" showIcon />;
  }

  return (
    <Row gutter={[24, 24]} justify="start">
      {users.map((user) => (
        <Col key={user.id} xs={24} sm={12} md={8} lg={6} xl={6}>
          <Card
            hoverable
            style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            className="text-center p-[24px]"
            actions={
              canSeeActions
                ? [
                    hasPermission("Manage Users") && (
                      <Tooltip title="Manage User" key="manage">
                        <Button
                          type="text"
                          icon={<SettingOutlined />}
                          onClick={() => onManageClick(user)}
                        />
                      </Tooltip>
                    ),
                    hasPermission("Update Users") && (
                      <Tooltip title="Edit User" key="edit">
                        <Button
                          type="text"
                          icon={<EditOutlined />}
                          onClick={() => onEditClick(user)}
                        />
                      </Tooltip>
                    ),
                    hasPermission("Delete Users") && (
                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => onDeleteSuccess(user.id)}
                        okText="Yes"
                        cancelText="No"
                        key="delete-confirm"
                      >
                        <Tooltip title="Delete User" key="delete-tooltip">
                          <Button type="text" icon={<DeleteOutlined />} danger />
                        </Tooltip>
                      </Popconfirm>
                    ),
                  ].filter(Boolean)
                : []
            }
          >
            {/* Avatar with initials */}
            <Avatar
              size={80}
              style={{ backgroundColor: '#7265e6', marginBottom: 16, fontSize: 32 }}
            >
              {getInitials(user.name)}
            </Avatar>

            {/* User Name */}
            <Title level={4} style={{ marginBottom: 8 }}>
              {user.name}
            </Title>

            {/* Roles as tags */}
            <div style={{ marginBottom: 16, justifyContent: 'start' }}>
              {user.roles && user.roles.length > 0 ? (
                <>
                  {user.roles.slice(0, 2).map((role) => (
                    <Tag color="default" key={role.id} style={{ fontWeight: '600' }}>
                      {role.name}
                    </Tag>
                  ))}
                  {user.roles.length > 2 && (
                    <Tooltip
                      title={
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                          {user.roles.map((role) => `• ${role.name}`).join('\n')}
                        </div>
                      }
                      placement="top"
                    >
                      <Tag color="default" style={{ fontWeight: '600', cursor: 'pointer' }}>
                        +{user.roles.length - 2} more
                      </Tag>
                    </Tooltip>
                  )}
                </>
              ) : (
                <Text type="secondary">No roles assigned</Text>
              )}
            </div>

            {/* Contact & Dates */}
            <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'left' }}>
              <Space>
                <MailOutlined style={{ color: '#1890ff' }} />
                <Text copyable>{user.email}</Text>
              </Space>

              <Space>
                <CalendarOutlined style={{ color: '#52c41a' }} />
                <Text>Created: {moment(user.created_at).format('MMM DD, YYYY')}</Text>
              </Space>

              <Space>
                <CalendarOutlined style={{ color: '#faad14' }} />
                <Text>Updated: {moment(user.updated_at).format('MMM DD, YYYY hh:mm A')}</Text>
              </Space>
            </Space>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default UsersGrid;
