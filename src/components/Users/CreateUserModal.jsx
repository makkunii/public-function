// src/components/CreateUserModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Space, message } from 'antd';
import { ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import UsersService from '../../services/UsersService';

const { Option } = Select;

function CreateUserModal({ tenant_key, isVisible, onCancel, onSuccess }) {
  const [createForm] = Form.useForm();

  useEffect(() => {
    if (isVisible) {
      createForm.resetFields();
    }
  }, [isVisible, createForm]);

  const handleSubmit = async (values) => {
    try {
      const dataToSend = { ...values, tenant_key: tenant_key };

      await UsersService.createUser(dataToSend);
      message.success('User created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.response && error.response.status === 422 && error.response.data.errors) {
        const errors = error.response.data.errors;
        const formErrors = Object.keys(errors).map(field => ({
          name: field,
          errors: errors[field]
        }));
        createForm.setFields(formErrors);
        message.error('Please fix the form errors.');
      } else {
        message.error('Failed to create user.');
      }
    }
  };

  return (
    <Modal
      title="Create New User"
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
          rules={[{ required: true, message: 'Please input the user name!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input the email!' },
            { type: 'email', message: 'The input is not a valid E-mail!' }, 
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 8, message: 'Password must be at least 8 characters long!' },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="password_confirmation" 
          dependencies={['password']} 
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

      </Form>
    </Modal>
  );
}

export default CreateUserModal;