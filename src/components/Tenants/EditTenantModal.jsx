// src/components/Tenants/EditTenantModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import TenantsService from '../../services/TenantsService';

const { Option } = Select;

function EditTenantModal({ isVisible, onCancel, onSuccess, initialValues }) {
  const [editForm] = Form.useForm();
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [currentKeyValue, setCurrentKeyValue] = useState('');
  const [isFormDirty, setIsFormDirty] = useState(false);
  const isKeyUnchangedFromInitial = currentKeyValue === (initialValues?.key || '');

  useEffect(() => {
    if (isVisible && initialValues) {
      editForm.setFieldsValue(initialValues);
      setCurrentKeyValue(initialValues.key || '');
      setIsFormDirty(false); 
    } else if (!isVisible) {
      editForm.resetFields();
      setCurrentKeyValue(''); 
      setIsFormDirty(false);
    }
  }, [isVisible, initialValues, editForm]);

  const handleGenerateKey = async () => {
    setIsGeneratingKey(true);
    try {
      const response = await TenantsService.generateKey();
      editForm.setFieldsValue({ key: response.key });
      setCurrentKeyValue(response.key);
      const initialKey = initialValues?.key || '';
      if (response.key !== initialKey) {
        setIsFormDirty(true);
      }
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

  const onFormFieldsChange = (changedFields) => {
    const keyField = changedFields.find(field => field.name && field.name[0] === 'key');
    if (keyField) {
      setCurrentKeyValue(keyField.value || '');
    }
  };

  // New handler for tracking form changes
  const handleValuesChange = (_, allValues) => {
    const hasChanges = Object.keys(allValues).some(key => {
        const currentValue = String(allValues[key] === undefined ? '' : allValues[key]);
        const initialValue = String(initialValues?.[key] === undefined ? '' : initialValues?.[key]);
        return currentValue !== initialValue;
    });
    setIsFormDirty(hasChanges);
  };


  const handleSubmit = async (values) => {
    if (!initialValues || !initialValues.id) {
      message.error('No tenant selected for editing.');
      return;
    }

    try {
      await TenantsService.updateTenant(initialValues.id, values);
      message.success('Tenant updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating tenant:', error);
      if (error.response) {
        console.error('Backend Error Response:', error.response.data);
        console.error('Backend Error Status:', error.response.status);

        if (error.response.status === 422 && error.response.data.errors) {
          const errors = error.response.data.errors;
          const formErrors = Object.keys(errors).map(field => ({
            name: field,
            errors: errors[field]
          }));
          editForm.setFields(formErrors);
          message.error('Please fix the form errors: ' + (error.response.data.message || 'Validation failed.'));
        } else {
          message.error('Failed to update tenant: ' + (error.response.data.message || error.message));
        }
      } else {
        message.error('Failed to update tenant. Network error or no response.');
      }
    }
  };

  return (
    <Modal
      title="Edit Tenant"
      open={isVisible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => editForm.submit()}
          disabled={!isFormDirty}
        >
          Save Changes
        </Button>,
      ]}
      destroyOnHidden={true}
    >
      <Form
        form={editForm}
        layout="vertical"
        onFinish={handleSubmit}
        onFieldsChange={onFormFieldsChange}
        onValuesChange={handleValuesChange}
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
              value={editForm.getFieldValue('key')}
              readOnly
              placeholder="Generate a key"
            />
            {!currentKeyValue && (
              <Button
                icon={<ReloadOutlined />}
                onClick={handleGenerateKey}
                loading={isGeneratingKey}
                disabled={isGeneratingKey}
                title="Generate New Key"
              >
              </Button>
            )}
            {!!currentKeyValue && (
              <>
                <Button
                  icon={<CopyOutlined />}
                  onClick={handleCopyKey}
                  title="Copy Key"
                >
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleGenerateKey}
                  loading={isGeneratingKey}
                  disabled={isGeneratingKey || !isKeyUnchangedFromInitial}
                  title="Regenerate Key"
                >
                </Button>
              </>
            )}
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

export default EditTenantModal;