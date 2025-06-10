import React from 'react';
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
  Input,
  message,
  Tooltip,
  Descriptions,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

function TenantsGrid({ tenants, loading, error, onDeleteSuccess, onEditClick }) {
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

  if (loading) return <Spin size="large" className="block text-center my-8" tip="Loading Tenants..." />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (tenants.length === 0) return <Alert message="No tenants found." type="info" showIcon />;

  return (
    <Row gutter={[16, 16]}>
      {tenants.map((tenant) => (
        <Col
          key={tenant.id}
          xs={24}
          sm={12}
          md={8}
          lg={6}
          xl={8}
        >
          <Card
            hoverable
            title={
              <Space align="center">
                <Text strong>{tenant.name}</Text>
              </Space>
            }
            extra={
              <Tag color={tenant.status === 'Active' ? 'green' : 'red'}>
                {tenant.status}
              </Tag>
            }
            actions={[
              <Tooltip title="Edit Tenant" key="edit">
                <Button type="text" icon={<EditOutlined />} onClick={() => onEditClick(tenant)}>
                  Edit
                </Button>
              </Tooltip>,
              <Popconfirm
                title="Are you sure to delete this tenant?"
                onConfirm={() => onDeleteSuccess(tenant.id)}
                okText="Yes"
                cancelText="No"
                key="delete-confirm"
              >
                <Tooltip title="Delete Tenant">
                  <Button type="text" icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Tooltip>
              </Popconfirm>,
            ]}
          >
            <Descriptions size="small" column={1} layout="vertical">
              <Descriptions.Item label="Subdomain">
                <Text copyable>{tenant.subdomain}</Text>
              </Descriptions.Item>

              <Descriptions.Item label="Access Key">
                <Space.Compact style={{ width: '100%' }}>
                  <Input.Password
                    value={tenant.key}
                    readOnly
                    style={{ width: 'calc(100% - 32px)' }}
                  />
                  <Button
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyKey(tenant.key)}
                    title="Copy Key"
                  />
                </Space.Compact>
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {moment(tenant.created_at).format('MMM DD, YYYY')}
              </Descriptions.Item>

              <Descriptions.Item label="Updated At">
                {moment(tenant.updated_at).format('MMM DD, YYYY hh:mm:ss A')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default TenantsGrid;
