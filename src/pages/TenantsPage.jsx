// src/pages/TenantsPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TenantsService from '../services/TenantsService';
import { Typography, Button, message, Input, Space } from 'antd';
import CreateTenantModal from '../components/Tenants/CreateTenantModal';
import TenantsTable from '../components/Tenants/TenantsTable';
import EditTenantModal from '../components/Tenants/EditTenantModal';
import { SearchOutlined, AppstoreOutlined, InsertRowAboveOutlined } from '@ant-design/icons';
// NEW: Import the TenantsGrid component (we'll create this next)
import TenantsGrid from '../components/Tenants/TenantsGrid';

const { Title } = Typography;
const { Group: ButtonGroup } = Button; // Import Button.Group for a neat button group

function TenantsPage() {
  const [allTenants, setAllTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // NEW STATE: To control whether to show table or grid view
  const [viewMode, setViewMode] = useState('table'); // Default to 'table' view

  const fetchTenants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await TenantsService.getAllTenants();
      setAllTenants(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tenants');
      console.error('Error fetching tenants:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const filteredTenants = useMemo(() => {
    if (!searchQuery) {
      return allTenants;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    return allTenants.filter(tenant =>
      tenant.name.toLowerCase().includes(lowerCaseQuery) ||
      tenant.subdomain.toLowerCase().includes(lowerCaseQuery) ||
      tenant.status.toLowerCase().includes(lowerCaseQuery) ||
      String(tenant.id).includes(lowerCaseQuery)
    );
  }, [allTenants, searchQuery]);

  const handleCreateModalOpen = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalVisible(false);
  };

  const handleCreateSuccess = () => {
    handleCreateModalClose();
    fetchTenants();
  };

  const handleEditModalOpen = (tenantData) => {
    setTenantToEdit(tenantData);
    setIsEditModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalVisible(false);
    setTenantToEdit(null);
  };

  const handleEditSuccess = () => {
    handleEditModalClose();
    fetchTenants();
  };

  const handleDeleteSuccess = async (id) => {
    try {
      await TenantsService.deleteTenant(id);
      message.success('Tenant deleted successfully');
      fetchTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
      message.error('Failed to delete tenant');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="mb-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <Title level={2} className="m-0">Tenant Management</Title>
      </div>

         <div className="flex flex-col-reverse lg:flex-row lg:justify-between gap-2">
                <div className="flex flex-row sm:flex-row gap-2">
                  <Button
                    type="default"
                    onClick={() => setViewMode('table')}
                    className={`w-full sm:w-1/2 ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    icon={<InsertRowAboveOutlined />}
                  >
                    List View
                  </Button>
                  
                  <Button
                    type="default"
                    onClick={() => setViewMode('grid')}
                    className={`w-full sm:w-1/2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    icon={<AppstoreOutlined />}
                  >
                    Grid View
                  </Button>
                </div>

           <div className="flex flex-col sm:flex-row lg:flex-row gap-2 w-full lg:w-auto">
              <Input
                placeholder="Search tenants..."
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={handleSearchChange}
                allowClear
                className="w-full sm:w-64"
              />
              <Button
                type="primary"
                onClick={handleCreateModalOpen}
                className="w-full sm:w-auto"
              >
                Create Tenant
              </Button>
           </div>

        </div>

</div>

      {/* NEW: Conditional Rendering based on viewMode */}
      {viewMode === 'table' ? (
        <TenantsTable
          tenants={filteredTenants}
          loading={loading}
          error={error}
          onDeleteSuccess={handleDeleteSuccess}
          onEditClick={handleEditModalOpen}
        />
      ) : (
        <TenantsGrid // This component will be created in the next step
          tenants={filteredTenants}
          loading={loading}
          error={error}
          onDeleteSuccess={handleDeleteSuccess}
          onEditClick={handleEditModalOpen}
        />
      )}

      <CreateTenantModal
        isVisible={isCreateModalVisible}
        onCancel={handleCreateModalClose}
        onSuccess={handleCreateSuccess}
      />

      <EditTenantModal
        isVisible={isEditModalVisible}
        onCancel={handleEditModalClose}
        onSuccess={handleEditSuccess}
        initialValues={tenantToEdit}
      />
    </div>
  );
}

export default TenantsPage;