// src/components/CreateRoleModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import RolesService from '../../services/RolesService';

const { Option } = Select;

function CreateRoleModal({ tenant_key, isVisible, onCancel, onSuccess }) {
  const [createForm] = Form.useForm();

  useEffect(() => {
    if (isVisible) {
      createForm.resetFields();
    }
  }, [isVisible, createForm]);

  const handleSubmit = async (values) => {
    try {
      const dataToSend = { ...values, tenant_key: tenant_key };

      await RolesService.createRole(dataToSend);
      message.success('Role created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating role:', error);
      if (error.response && error.response.status === 422 && error.response.data.errors) {
        const errors = error.response.data.errors;
        const formErrors = Object.keys(errors).map(field => ({
          name: field,
          errors: errors[field]
        }));
        createForm.setFields(formErrors);
        message.error('Please fix the form errors.');
      } else {
        message.error('Failed to create role.');
      }
    }
  };

  return (
    <Modal
      title="Create New Role"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button disabled={!tenant_key} key="submit" type="primary" onClick={() => createForm.submit()}>
          Create
        </Button>
      ]}
    >
      <Form
        form={createForm}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the role name!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateRoleModal;