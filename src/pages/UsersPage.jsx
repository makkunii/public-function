// src/pages/UsersPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import UsersService from '../services/UsersService';
import { Typography, Button, message, Input, Spin, Alert } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import UsersControlBar from '../components/Users/UsersControlBar';
import CreateUserModal from '../components/Users/CreateUserModal';
import UsersTable from '../components/Users/UsersTable';
import EditUserModal from '../components/Users/EditUserModal';
import UsersGrid from '../components/Users/UsersGrid';
import ManageUserDrawer from '../components/Users/ManageUserDrawer';
import { usePermissions } from '../hooks/usePermissions';

import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

function UsersPage() {
  const { hasPermission } = usePermissions();
  const { tenantKey } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenantKeyInput, setTenantKeyInput] = useState(tenantKey || '');
  const [viewMode, setViewMode] = useState('table');

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [userToManage, setUserToManage] = useState(null);

  const fetchUsers = async (tenantKeyInput) => {
    setLoading(true);
    setError(null);
    try {
      const data = await UsersService.getAllUsers({ "tenant_key": tenantKeyInput || tenantKey });
      setAllUsers(data.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch users';
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
}, [tenantKeyInput]);

  const filteredUsers = useMemo(() => {
    let currentUsers = allUsers;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      currentUsers = currentUsers.filter(user =>
        user.name.toLowerCase().includes(lowerCaseQuery) ||
        user.email.toLowerCase().includes(lowerCaseQuery) ||
        String(user.id).includes(lowerCaseQuery)
      );
    }

    return currentUsers;
  }, [allUsers, searchQuery]);

  const handleFilterByTenantKey = () => {
    if (!tenantKeyInput) {
      message.warning('Please enter a Tenant Key to filter users.');
      return;
    }
    fetchUsers(tenantKeyInput);
  };

  const handleResetFilters = () => {
    setTenantKeyInput('');
    setSearchQuery('');
    setAllUsers([]);
    setError(null);
  };

  const handleCreateModalOpen = () => setIsCreateModalVisible(true);
  const handleCreateModalClose = () => setIsCreateModalVisible(false);
  const handleCreateSuccess = () => {
    handleCreateModalClose();
    if (tenantKeyInput) {
      fetchUsers(tenantKeyInput);
    }
  };

  const handleEditModalOpen = (userData) => {
    setUserToEdit(userData);
    setIsEditModalVisible(true);
  };
  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setUserToEdit(null);
  };
  const handleEditSuccess = () => {
    handleEditModalClose();
    if (tenantKeyInput) {
      fetchUsers(tenantKeyInput);
    }
  };

  const handleDeleteSuccess = async (id) => {
    if (!tenantKeyInput) {
      message.error('Tenant Key is required to delete a user.');
      return;
    }
    try {
      await UsersService.deleteUser(id, tenantKeyInput);
      message.success('User deleted successfully');
      fetchUsers(tenantKeyInput);
    } catch (error) {
      message.error('Failed to delete user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleManageDrawerOpen = (userData) => {
    setUserToManage(userData);
    setIsDrawerVisible(true);
  };

  const handleManageDrawerClose = () => {
    setIsDrawerVisible(false);
    setUserToManage(null);
    if (tenantKeyInput) {
      fetchUsers(tenantKeyInput);
    }
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <Title level={2}>User Accounts</Title>
        <UsersControlBar
          tenantKeyInput={tenantKeyInput}
          setTenantKeyInput={setTenantKeyInput}
          handleFilterByTenantKey={handleFilterByTenantKey}
          handleResetFilters={handleResetFilters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          viewMode={viewMode}
          setViewMode={setViewMode}
          handleCreateModalOpen={handleCreateModalOpen}
          loading={loading}
        />
      </div>

      {error ? (
        <Alert message="Error" description={error} type="error" showIcon className="mb-4" />
      ) : (
        <Spin spinning={loading} tip="Loading users..." size="large" className="block text-center my-8">
          {hasPermission("Read Users") ? (
          viewMode === 'table' ? (
            <UsersTable
              users={filteredUsers}
              onDeleteSuccess={handleDeleteSuccess}
              onEditClick={handleEditModalOpen}
              onManageClick={handleManageDrawerOpen}
            />
          ) : (
            <UsersGrid
              users={filteredUsers}
              onDeleteSuccess={handleDeleteSuccess}
              onEditClick={handleEditModalOpen}
              onManageClick={handleManageDrawerOpen}
            />
          )
          ) : (
            <Alert
              message="Access Denied"
              description="You do not have permission to view users."
              type="warning"
              showIcon
              className="my-8"
            />
          )}
        </Spin>
      )}

      <CreateUserModal
        tenant_key={tenantKeyInput}
        isVisible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />

      <EditUserModal
        isVisible={isEditModalVisible}
        onCancel={handleEditModalClose}
        onSuccess={handleEditSuccess}
        initialValues={userToEdit}
        tenant_key={tenantKeyInput}
      />

      <ManageUserDrawer
        visible={isDrawerVisible}
        onClose={handleManageDrawerClose}
        user={userToManage}
        tenant_key={tenantKeyInput}
      />
    </div>
  );
}

export default UsersPage;