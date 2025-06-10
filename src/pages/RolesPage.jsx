// src/pages/RolesPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import RolesService from '../services/RolesService';
import { Typography, Button, message, Input, Spin, Alert, Tabs, Drawer, Descriptions } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import RolesControlBar from '../components/Roles/RolesControlBar';
import CreateRoleModal from '../components/Roles/CreateRoleModal';
import RolesTable from '../components/Roles/RolesTable';
import EditRoleModal from '../components/Roles/EditRoleModal';
import RolesGrid from '../components/Roles/RolesGrid';
import ManageRoleDrawer from '../components/Roles/ManageRoleDrawer';
import { usePermissions } from '../hooks/usePermissions';

import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

function RolesPage() {
  const { hasPermission } = usePermissions();
  const { tenantKey } = useAuth();
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenantKeyInput, setTenantKeyInput] = useState(tenantKey || '');
  const [viewMode, setViewMode] = useState('table');

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [roleToManage, setRoleToManage] = useState(null);


 const fetchRoles = async (tenantKeyInput) => {
      setLoading(true);
      setError(null);
      try {
        const data = await RolesService.getAllRoles({ "tenant_key": tenantKeyInput || tenantKey });
        setAllRoles(data.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch roles';
        setError(errorMessage);
        message.error(errorMessage);
      } finally {
        setLoading(false);
      }
 };

   useEffect(() => {
     fetchRoles();
 }, [tenantKeyInput]);

  const filteredRoles = useMemo(() => {
      let currentRoles = allRoles;
  
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        currentRoles = currentRoles.filter(role =>
          role.name.toLowerCase().includes(lowerCaseQuery) ||
          String(role.id).includes(lowerCaseQuery)
        );
      }
  
      return currentRoles;
  }, [allRoles, searchQuery]);

  const handleFilterByTenantKey = () => {
      fetchRoles(tenantKeyInput);
  };

  const handleResetFilters = () => {
      setTenantKeyInput('');
      setSearchQuery('');
      setAllRoles([]);
      setError(null);
  };

  const handleCreateModalOpen = () => setIsCreateModalVisible(true);
  const handleCreateModalClose = () => setIsCreateModalVisible(false);
  const handleCreateSuccess = () => {
    handleCreateModalClose();
    fetchRoles(tenantKeyInput);
  };

  const handleEditModalOpen = (roleData) => {
      setRoleToEdit(roleData);
      setIsEditModalVisible(true);
    };
  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setRoleToEdit(null);
  };
  const handleEditSuccess = () => {
    handleEditModalClose();
    fetchRoles(tenantKeyInput);
  };

  const handleDeleteSuccess = async (id) => {
    try {
      await RolesService.deleteRole(id, tenantKeyInput);
      message.success('Role deleted successfully');
      fetchRoles(tenantKeyInput);
    } catch (error) {
      message.error('Failed to delete role',error?.message);
    }
  };

  const handleManageDrawerOpen = (roleData) => {
    setRoleToManage(roleData);
    setIsDrawerVisible(true);
  };

  const handleManageDrawerClose = () => {
    setIsDrawerVisible(false);
    setRoleToManage(null);
  };


  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
        <Title level={2}>Manage Roles</Title>
        <RolesControlBar
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
          {hasPermission("Read Roles") ? (
          viewMode === 'table' ? (
          <RolesTable
          roles={filteredRoles}
          onDeleteSuccess={handleDeleteSuccess}
          onEditClick={handleEditModalOpen}
          onManageClick={handleManageDrawerOpen}
        />
          ) : (
          <RolesGrid
          roles={filteredRoles}
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

      <CreateRoleModal
        tenant_key={tenantKeyInput}
        isVisible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />

      <EditRoleModal
        isVisible={isEditModalVisible}
        onCancel={handleEditModalClose}
        onSuccess={handleEditSuccess}
        initialValues={roleToEdit}
        tenant_key={tenantKeyInput}
      />

      <ManageRoleDrawer
        visible={isDrawerVisible}
        onClose={handleManageDrawerClose}
        role={roleToManage}
        onEdit={handleEditModalOpen}
        tenant_key={tenantKeyInput}
      />

    </div>
  );
}

export default RolesPage;
