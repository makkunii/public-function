// src/components/Permissions/PermissionsTable.jsx
import React from 'react';
import { Table, Button, Space, Popconfirm, Tag, Input} from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import { usePermissions } from '../../hooks/usePermissions';
import Grid from 'antd/es/grid';
const { useBreakpoint } = Grid;

function PermissionsTable({ permissions, loading, error, onDeleteSuccess, onEditClick, onManageClick }) {
  const screens = useBreakpoint();
  const { hasPermission } = usePermissions();

  const columns = [
    {
      title: 'Permissions',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      sorter: (a, b) => a.module.localeCompare(b.module),
    },
     hasPermission('Permission Actions') && {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          {/* <Button
            icon={<SettingOutlined />}
            onClick={() => onManageClick(record)}
            variant="outlined"
            color="default" 
            size="small"
          >
            {(screens.md || screens.lg || screens.xl || screens.xxl) && 'Manage'}
          </Button> */}
          {hasPermission("Update Permissions") &&
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
          {hasPermission("Delete Permissions") &&
          <Popconfirm
            title="Are you sure to delete this permission?"
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
      dataSource={permissions}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      scroll={{ x: 'max-content' }}
      bordered
    />
  );
}

export default PermissionsTable;