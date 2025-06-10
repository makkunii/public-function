// src/components/Users/UsersTable.jsx
import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Avatar, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { usePermissions } from '../../hooks/usePermissions';
import Grid from 'antd/es/grid';
const { useBreakpoint } = Grid;
import moment from 'moment';

function UsersTable({ users, loading, error, onDeleteSuccess, onEditClick, onManageClick }) {
  const screens = useBreakpoint();
  const { hasPermission } = usePermissions();

  // Helper to get initials from a full name
  const getInitials = (name) => {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Space align="center">
            <Avatar 
              src={record.avatar_url} 
              alt={record.name} 
              size="large"
            >
              {!record.avatar_url && getInitials(record.name)}
            </Avatar>
            <span>{record.name}</span>
          </Space>
          {record.roles && record.roles.length > 0 && (
            <div style={{ marginLeft: 44, marginTop: 4 }}>
              {record.roles.slice(0, 3).map(role => (
                <Tag
                  className="cursor-pointer"
                  key={role.id}
                  color="default"
                  style={{ marginRight: 4, fontSize: 12 }}
                >
                  {role.name}
                </Tag>
              ))}

              {record.roles.length > 3 && (
                <Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {record.roles.map((role) => `• ${role.name}`).join('\n')}
                  </div>
                }
                placement="top"
              >
                <Tag color="default" style={{ fontWeight: '600', cursor: 'pointer' }}>
                  +{record.roles.length - 3} more
                </Tag>
              </Tooltip>
              )}
            </div>
          )}

        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      responsive: ['sm'],
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (text) => text ? moment(text).format('MMMM, DD, YYYY') : 'N/A',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
      render: (text) => text ? moment(text).format('MMMM, DD, YYYY hh:mm:ss A') : 'N/A',
    },
    hasPermission('User Actions') && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {hasPermission("Manage Users") &&
          <Button
            icon={<SettingOutlined />}
            onClick={() => onManageClick(record)}
            size="small"
          >
            {(screens.md || screens.lg || screens.xl || screens.xxl) && 'Manage'}
          </Button>
          }
          {hasPermission("Update Users") &&
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditClick(record)}
            type="primary"
            ghost
            size="small"
          >
            {(screens.md || screens.lg || screens.xl || screens.xxl) && 'Edit'}
          </Button>
          }
          {hasPermission("Delete Users") &&
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => onDeleteSuccess(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              {(screens.md || screens.lg || screens.xl || screens.xxl) && 'Delete'}
            </Button>
          </Popconfirm>
          }
        </Space>
      ),
      fixed: 'right',
      width: screens.md ? 120 : 70,
    },
  ].filter(Boolean); ;

  if (loading) {
    return <Table columns={columns} loading={true} pagination={false} />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <Table
      columns={columns}
      dataSource={users}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
      bordered
    />
  );
}

export default UsersTable;
