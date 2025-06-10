// src/components/Users/EditUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import UsersService from '../../services/UsersService';

function EditUserModal({ tenant_key, isVisible, onCancel, onSuccess, initialValues }) {
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
      message.error('No user selected for editing.');
      return;
    }

    const dataToSend = { ...values, tenant_key: tenant_key };

    if (!dataToSend.password) {
        delete dataToSend.password;
    }
    if (!dataToSend.password_confirmation) {
        delete dataToSend.password_confirmation;
    }

    if ((dataToSend.password && !dataToSend.password_confirmation) || (!dataToSend.password && dataToSend.password_confirmation)) {
        message.error('Please confirm your password.');
        return;
    }

    try {
      await UsersService.updateUser(initialValues.id, dataToSend);
      message.success('User updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating user:', error);
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
          message.error('Failed to update user: ' + (error.response.data.message || error.message));
        }
      } else {
        message.error('Failed to update user. Network error or no response.');
      }
    }
  };

  return (
    <Modal
      title="Edit User"
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
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email address!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
            label="New Password (optional)"
            name="password"
            rules={[
                {
                    min: 8,
                    message: 'Password must be at least 8 characters long!',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!value || getFieldValue('password_confirmation') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                }),
            ]}
        >
            <Input.Password placeholder="Leave empty to keep current password" />
        </Form.Item>

        <Form.Item
            label="Confirm New Password"
            name="password_confirmation"
            dependencies={['password']}
            rules={[
                ({ getFieldValue }) => ({
                    validator(_, value) {
                        if (!getFieldValue('password') || value === getFieldValue('password')) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                    },
                }),
            ]}
        >
            <Input.Password placeholder="Confirm new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditUserModal;