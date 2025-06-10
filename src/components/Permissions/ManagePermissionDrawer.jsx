import React from 'react';
import { Drawer, Descriptions, Button } from 'antd';
import moment from 'moment';

function ManagePermissionDrawer({ visible, onClose, permission, onEdit }) {
  return (
    <Drawer
      title={permission ? `Manage Permission: ${permission.name}` : 'Manage Permission'}
      placement="right"
      width="100%"
      onClose={onClose}
      open={visible}
    >
      {permission ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Permission ID">{permission.id}</Descriptions.Item>
          <Descriptions.Item label="Permission Name">{permission.name}</Descriptions.Item>
          {permission.description && (
            <Descriptions.Item label="Description">{permission.description}</Descriptions.Item>
          )}
          <Descriptions.Item label="Created At">
            {permission.created_at ? moment(permission.created_at).format('MMMM DD, YYYY') : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {permission.updated_at ? moment(permission.updated_at).format('MMMM DD, YYYY') : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <p>No permission selected for management.</p>
      )}

      <div style={{ marginTop: 24 }}>
        <Button onClick={onClose} style={{ marginRight: 8 }}>
          Close
        </Button>
        {permission && (
          <Button type="primary" onClick={() => {
            onEdit(permission);
            onClose();
          }}>
            Edit Permission
          </Button>
        )}
      </div>
    </Drawer>
  );
}

export default ManagePermissionDrawer;
