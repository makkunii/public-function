// src/components/Permissions/EditPermissionModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import PermissionsService from '../../services/PermissionsService';

function EditPermissionModal({ tenant_key, isVisible, onCancel, onSuccess, initialValues }) {
  const [editForm] = Form.useForm();
  const [isFormDirty, setIsFormDirty] = useState(false);

  useEffect(() => {
    if (isVisible && initialValues) {
      editForm.setFieldsValue(initialValues);
      setIsFormDirty(false);
    } else if (!isVisible) {
      editForm.resetFields();
      setIsFormDirty(false);
    }
  }, [isVisible, initialValues, editForm]);

  const onFormFieldsChange = () => {
    // This function can remain empty if no specific field-level side effects are needed.
  };

  const handleValuesChange = (_, allValues) => {
    const hasChanges = Object.keys(allValues).some(key => {
        if (key === 'password' || key === 'password_confirmation') {
            return allValues[key] !== undefined && allValues[key] !== '';
        }

        const currentValue = String(allValues[key] === undefined ? '' : allValues[key]);
        const initialValue = String(initialValues?.[key] === undefined ? '' : initialValues?.[key]);
        return currentValue !== initialValue;
    });
    setIsFormDirty(hasChanges);
  };

  const handleSubmit = async (values) => {
    if (!initialValues || !initialValues.id) {
      message.error('No permission selected for editing.');
      return;
    }

    const dataToSend = { ...values, tenant_key: tenant_key };
    try {
      await PermissionsService.updatePermission(initialValues.id, dataToSend);
      message.success('Permission updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating permission:', error);
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
          message.error('Failed to update permission: ' + (error.response.data.message || error.message));
        }
      } else {
        message.error('Failed to update permission. Network error or no response.');
      }
    }
  };

  return (
    <Modal
      title="Edit Permission"
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
          rules={[{ required: true, message: 'Please input name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Module"
          name="module"
          rules={[{ required: true, message: 'Please input module!' }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditPermissionModal;