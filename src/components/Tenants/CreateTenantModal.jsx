// src/components/CreateTenantModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import TenantsService from '../../services/TenantsService'; // Import TenantsService

const { Option } = Select;

function CreateTenantModal({ isVisible, onCancel, onSuccess }) {
  const [createForm] = Form.useForm();
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [currentKeyValue, setCurrentKeyValue] = useState('');

  // Effect to sync currentKeyValue with form's actual value when modal opens/resets
  useEffect(() => {
    if (isVisible) {
      createForm.resetFields(); // Ensure fields are cleared when opening
      setCurrentKeyValue(''); // Clear local state as well
    }
  }, [isVisible, createForm]);

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);
    try {
      const response = await TenantsService.generateKey();
      createForm.setFieldsValue({ key: response.key });
      setCurrentKeyValue(response.key);
      message.success('Key generated successfully!');
    } catch (error) {
      console.error('Error generating key:', error);
      message.error('Failed to generate key.');
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const handleCopyKey = async () => {
    if (currentKeyValue) {
      try {
        await navigator.clipboard.writeText(currentKeyValue);
        message.success('Key copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy key:', err);
        message.error('Failed to copy key to clipboard.');
      }
    } else {
      message.warning('No key to copy.');
    }
  };

  // This function keeps currentKeyValue synced with the form's internal 'key' field value
  const onFormFieldsChange = (changedFields) => {
    const keyField = changedFields.find(field => field.name && field.name[0] === 'key');
    if (keyField) {
      setCurrentKeyValue(keyField.value || '');
    }
  };

  const handleSubmit = async (values) => {
    try {
      await TenantsService.createTenant(values);
      message.success('Tenant created successfully');
      onSuccess(); // Call the success callback provided by parent
    } catch (error) {
      console.error('Error creating tenant:', error);
      // Backend validation errors (e.g., unique constraints) typically come as 422
      if (error.response && error.response.status === 422 && error.response.data.errors) {
        // Ant Design form can set field errors directly
        const errors = error.response.data.errors;
        const formErrors = Object.keys(errors).map(field => ({
          name: field,
          errors: errors[field]
        }));
        createForm.setFields(formErrors);
        message.error('Please fix the form errors.');
      } else {
        message.error('Failed to create tenant.');
      }
    }
  };

  return (
    <Modal
      title="Create New Tenant"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => createForm.submit()}>
          Create
        </Button>,
      ]}
    >
      <Form
        form={createForm}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={onFormFieldsChange}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input the tenant name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subdomain"
          name="subdomain"
          rules={[{ required: true, message: 'Please input the subdomain!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Key"
          name="key"
          required
          rules={[{ required: true, message: 'Please generate the key!' }]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input.Password
              value={createForm.getFieldValue('key')}
              readOnly
              placeholder="Generate a key"
            />
            <Button
              icon={<ReloadOutlined />}
              onClick={handleGenerateKey}
              loading={isGeneratingKey}
              disabled={isGeneratingKey}
              hidden={!!currentKeyValue}
              title="Generate New Key"
            />
            <Button
              icon={<CopyOutlined />}
              onClick={handleCopyKey}
              disabled={!currentKeyValue}
              hidden={!currentKeyValue}
              title="Copy Key"
            />
          </Space.Compact>
        </Form.Item>

        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select the status!' }]}
        >
          <Select placeholder="Select Status">
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CreateTenantModal;