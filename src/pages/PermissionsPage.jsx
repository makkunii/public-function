// src/pages/PermissionsPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import PermissionsService from '../services/PermissionsService';
import { Typography, Button, message, Input, Spin, Alert, Tabs, Drawer, Descriptions } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import PermissionsControlBar from '../components/Permissions/PermissionsControlBar';
import CreatePermissionModal from '../components/Permissions/CreatePermissionModal';
import PermissionsTable from '../components/Permissions/PermissionsTable';
import EditPermissionModal from '../components/Permissions/EditPermissionModal';
import PermissionsGrid from '../components/Permissions/PermissionsGrid';
import ManagePermissionDrawer from '../components/Permissions/ManagePermissionDrawer';
import { usePermissions } from '../hooks/usePermissions';
import { useAuth } from '../context/AuthContext';


const { Title } = Typography;

function PermissionsPage() {
  const { hasPermission } = usePermissions();
  const { tenantKey } = useAuth();
  const [allPermissions, setAllPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [permissionToEdit, setPermissionToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenantKeyInput, setTenantKeyInput] = useState(tenantKey || '');
  const [viewMode, setViewMode] = useState('table');

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [permissionToManage, setPermissionToManage] = useState(null);


 const fetchPermissions = async (tenantKey) => {
      setLoading(true);
      setError(null);
      try {
        const data = await PermissionsService.getAllPermissions({ "tenant_key": tenantKeyInput || tenantKey });
        setAllPermissions(data.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch permissions';
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
 };

  useEffect(() => {
     fetchPermissions();
 }, [tenantKeyInput]);



  const filteredPermissions = useMemo(() => {
      let currentPermissions = allPermissions;
  
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        currentPermissions = currentPermissions.filter(permission =>
          permission.name.toLowerCase().includes(lowerCaseQuery) ||
          String(permission.id).includes(lowerCaseQuery)
        );
      }
  
      return currentPermissions;
  }, [allPermissions, searchQuery]);

  const handleFilterByTenantKey = () => {
      fetchPermissions(tenantKeyInput);
  };

  const handleResetFilters = () => {
      setTenantKeyInput('');
      setSearchQuery('');
      setAllPermissions([]);
      setError(null);
  };

  const handleCreateModalOpen = () => setIsCreateModalVisible(true);
  const handleCreateModalClose = () => setIsCreateModalVisible(false);
  const handleCreateSuccess = () => {
    handleCreateModalClose();
    fetchPermissions(tenantKeyInput);
  };

  const handleEditModalOpen = (permissionData) => {
      setPermissionToEdit(permissionData);
      setIsEditModalVisible(true);
    };
  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setPermissionToEdit(null);
  };
  const handleEditSuccess = () => {
    handleEditModalClose();
    fetchPermissions(tenantKeyInput);
  };

  const handleDeleteSuccess = async (id) => {
    try {
      await PermissionsService.deletePermission(id, tenantKeyInput);
      message.success('Permission deleted successfully');
      fetchPermissions(tenantKeyInput);
    } catch (error) {
      message.error('Failed to delete permission', error?.message);
    }
  };

  const handleManageDrawerOpen = (permissionData) => {
    setPermissionToManage(permissionData);
    setIsDrawerVisible(true);
  };

  const handleManageDrawerClose = () => {
    setIsDrawerVisible(false);
    setPermissionToManage(null);
  };


  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <Title level={2}>Manage Permissions</Title>
        <PermissionsControlBar
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
          {hasPermission("Read Permissions") ? (
          viewMode === 'table' ? (
             <PermissionsTable
          permissions={filteredPermissions}
          onDeleteSuccess={handleDeleteSuccess}
          onEditClick={handleEditModalOpen}
          onManageClick={handleManageDrawerOpen}
        />
          ) : (
           <PermissionsGrid
          permissions={filteredPermissions}
          onDeleteSuccess={handleDeleteSuccess}
          onEditClick={handleEditModalOpen}
          onManageClick={handleManageDrawerOpen}
        />
          )
          ) : (
            <Alert
              message="Access Denied"
              description="You do not have permission to view Permissions."
              type="warning"
              showIcon
              className="my-8"
            />
          )}
        </Spin>
      )}

      <CreatePermissionModal
        tenant_key={tenantKeyInput}
        isVisible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />

      <EditPermissionModal
        isVisible={isEditModalVisible}
        onCancel={handleEditModalClose}
        onSuccess={handleEditSuccess}
        initialValues={permissionToEdit}
        tenant_key={tenantKeyInput}
      />

      <ManagePermissionDrawer
        visible={isDrawerVisible}
        onClose={handleManageDrawerClose}
        permission={permissionToManage}
        onEdit={handleEditModalOpen}
      />

    </div>
  );
}

export default PermissionsPage;
