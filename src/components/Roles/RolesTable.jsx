// src/components/Roles/RolesTable.jsx
import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, message, Input} from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import { usePermissions } from '../../hooks/usePermissions';
import Grid from 'antd/es/grid';
const { useBreakpoint } = Grid;

function RolesTable({ roles, loading, error, onDeleteSuccess, onEditClick, onManageClick }) {
  const screens = useBreakpoint();
  const { hasPermission } = usePermissions();

  const columns = [
    {
      title: 'Roles',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
     hasPermission('Role Actions') && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {hasPermission("Manage Roles") &&
          <Button
            icon={<SettingOutlined />}
            onClick={() => onManageClick(record)}
            variant="outlined"
            color="default" 
            size="small"
          >
            {(screens.md || screens.lg || screens.xl || screens.xxl) && 'Manage'}
          </Button>
          }
          {hasPermission("Update Roles") &&
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
          {hasPermission("Delete Roles") &&
          <Popconfirm
            title="Are you sure to delete this role?"
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
      dataSource={roles}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
      bordered
    />
  );
}

export default RolesTable;