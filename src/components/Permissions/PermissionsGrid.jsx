// src/components/Permissions/PermissionsGrid.jsx
import React from 'react';
import { Card, Button, Space, Popconfirm, Tag, Row, Col, Typography, Spin, Alert, Input } from 'antd';
import { EditOutlined, DeleteOutlined, CopyOutlined, SettingOutlined } from '@ant-design/icons';
import moment from 'moment'; // Assuming you have moment.js installed

const { Text } = Typography;
const { Meta } = Card;

function PermissionsGrid({ permissions, loading, error, onDeleteSuccess, onEditClick }) {

  if (loading) {
    return <Spin size="large" className="block text-center my-8" tip="Loading Permissions..." />;
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (permissions.length === 0) {
    return <Alert message="No permissions found." type="info" showIcon />;
  }

  return (
    <Row gutter={[16, 16]}>
      {permissions.map(permission => (
        <Col
          key={permission.id}
          xs={24} // Full width on extra small screens
          sm={12} // Half width on small screens
          md={8}  // One-third width on medium screens
          lg={6}  // One-fourth width on large screens
          xl={8}  // One-fifth width on extra large screens
        >
          <Card
            hoverable
            title={permission.name}
            actions={[
              // <Button type="text" icon={<SettingOutlined />} onClick={() => onManageClick(permission)} key="manage">
              //   Manage
              // </Button>,
              <Button type="text" icon={<EditOutlined />} onClick={() => onEditClick(permission)} key="edit">
                Edit
              </Button>,
              <Popconfirm
                title="Are you sure to delete this permission?"
                onConfirm={() => onDeleteSuccess(permission.id)}
                okText="Yes"
                cancelText="No"
                key="delete-confirm"
              >
                <Button type="text" icon={<DeleteOutlined />} danger key="delete">
                  Delete
                </Button>
              </Popconfirm>,
            ]}
          >
            <Meta
              description={
                <Space direction="vertical" size={2} className="w-full">
             
                  <div className="flex lg:flex-row flex-col gap-2 pt-5 lg:pt-[100px]">
                    <Text strong>Created:</Text> 
                    <Text>{moment(permission.created_at).format('MMM, DD, YYYY')}</Text>
                  </div>

                  <div className="flex lg:flex-row flex-col gap-2">
                    <Text strong>Updated:</Text> 
                    <Text>{moment(permission.updated_at).format('MMM, DD, YYYY hh:mm:ss A')}</Text>
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

export default PermissionsGrid;