// src/components/Roles/RolesGrid.jsx
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Card, Button, Space, Popconfirm, Row, Col, Typography, Spin, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;
const { Meta } = Card;

function RolesGrid({ roles, loading, error, onDeleteSuccess, onEditClick, onManageClick }) {
  const { hasPermission } = usePermissions();

  const canSeeActions = hasPermission("Role Actions");

  if (loading) {
    return <Spin size="large" className="block text-center my-8" tip="Loading Roles..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (roles.length === 0) {
    return <Alert message="No roles found." type="info" showIcon />;
  }

  return (
    <Row gutter={[16, 16]}>
      {roles.map(role => (
        <Col
          key={role.id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={8}
        >
          <Card
            hoverable
            title={role.name}
            actions={
              canSeeActions
                ? [
                    hasPermission("Manage Roles") && (
                      <Button
                        type="text"
                        icon={<SettingOutlined />}
                        onClick={() => onManageClick(role)}
                        key="manage"
                      >
                        Manage
                      </Button>
                    ),
                    hasPermission("Update Roles") && (
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEditClick(role)}
                        key="edit"
                      >
                        Edit
                      </Button>
                    ),
                    hasPermission("Delete Roles") && (
                      <Popconfirm
                        title="Are you sure to delete this role?"
                        onConfirm={() => onDeleteSuccess(role.id)}
                        okText="Yes"
                        cancelText="No"
                        key="delete-confirm"
                      >
                        <Button type="text" icon={<DeleteOutlined />} danger key="delete">
                          Delete
                        </Button>
                      </Popconfirm>
                    ),
                  ].filter(Boolean)
                : []
            }
          >
            <Meta
              description={
                <Space direction="vertical" size={2} className="w-full">
                  <div className="flex lg:flex-row flex-col gap-2 pt-5 lg:pt-[100px]">
                    <Text strong>Created:</Text>
                    <Text>{moment(role.created_at).format('MMM, DD, YYYY')}</Text>
                  </div>

                  <div className="flex lg:flex-row flex-col gap-2">
                    <Text strong>Updated:</Text>
                    <Text>{moment(role.updated_at).format('MMM, DD, YYYY hh:mm:ss A')}</Text>
                  </div>
                </Space>
              }
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default RolesGrid;
