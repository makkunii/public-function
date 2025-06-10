// src/components/Tenants/TenantsTable.jsx
import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined } from '@ant-design/icons';
import moment from 'moment';
import Grid from 'antd/es/grid';

const { useBreakpoint } = Grid;

function TenantsTable({ tenants, loading, error, onDeleteSuccess, onEditClick }) {
  const screens = useBreakpoint();

  const handleCopyKey = async (keyToCopy) => {
    if (keyToCopy) {
      try {
        await navigator.clipboard.writeText(keyToCopy);
        message.success('Key copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy key:', err);
        message.error('Failed to copy key to clipboard.');
      }
    } else {
      message.warning('No key to copy.');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Subdomain',
      dataIndex: 'subdomain',
      key: 'subdomain',
      sorter: (a, b) => a.subdomain.localeCompare(b.subdomain),
      responsive: ['sm'],
    },
    {
      title: 'Key',
      dataIndex: 'key',
      key: 'key',
      render: (text) => (
        <Space.Compact style={{ width: '100%' }}>
          <Input.Password
            value={text}
            readOnly
            style={{ width: 'calc(100% - 32px)' }}
          />
          <Button
            icon={<CopyOutlined />}
            onClick={() => handleCopyKey(text)}
            title="Copy Key"
          />
        </Space.Compact>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Created At',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      render: (text) => text ? moment(text).format('MMM DD, YYYY') : 'N/A',
    },
    {
      title: 'Updated At',
      dataIndex: 'updated_at',
      key: 'updated_at',
      sorter: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
      render: (text) => text ? moment(text).format('MMM DD, YYYY hh:mm A') : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => onEditClick(record)}
            type="primary"
            ghost
            size="small"
          >
            {screens.md && 'Edit'}
          </Button>
          <Popconfirm
            title="Are you sure to delete this tenant?"
            onConfirm={() => onDeleteSuccess(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              {screens.md && 'Delete'}
            </Button>
          </Popconfirm>
        </Space>
      ),
      fixed: 'right',
      width: screens.md ? 140 : 70,
    },
  ];

  if (loading) {
    return <Table columns={columns} loading pagination={false} />;
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <Table
      columns={columns}
      dataSource={tenants}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
      bordered
    />
  );
}

export default TenantsTable;
