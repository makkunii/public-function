// src/components/Permissions/PermissionsControlBar.jsx
import React from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { Button, Input } from 'antd';
import {
  SearchOutlined,
  AppstoreOutlined,
  InsertRowAboveOutlined,
  UsergroupAddOutlined,
  ReloadOutlined
} from '@ant-design/icons';

function PermissionsControlBar({
  tenantKeyInput,
  setTenantKeyInput,
  handleFilterByTenantKey,
  handleResetFilters,
  searchQuery,
  setSearchQuery,
  setViewMode,
  handleCreateModalOpen,
  loading // Pass loading to disable buttons during fetch
}) {

    const { hasPermission } = usePermissions();
  

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-start lg:items-center gap-4 mt-4">

      {/* LEFT: Tenant Filter & Reset */}
     
      <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-[500px]">
        {hasPermission("Tenant Control") &&
        <>
        <Input
          placeholder="Enter Tenant Key..."
          prefix={<UsergroupAddOutlined />}
          value={tenantKeyInput}
          onChange={(e) => setTenantKeyInput(e.target.value)}
          allowClear
          className="w-full lg:w-64"
        />
        <Button
          type="primary"
          onClick={handleFilterByTenantKey}
          icon={<SearchOutlined />}
          className="w-full lg:w-auto"
          loading={loading}
        >
          Filter
        </Button>
        <Button
          onClick={handleResetFilters}
          icon={<ReloadOutlined />}
          className="w-full lg:w-auto"
          loading={loading}
        >
          Reset
        </Button>
        </>
        }
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-2 w-full lg:w-[600px]">

        {/* View Mode Buttons */}
        <div className="flex flex-row gap-2 w-full lg:w-auto">
          <Button
            type="default"
            onClick={() => setViewMode('table')}
            icon={<InsertRowAboveOutlined />}
            className="w-full lg:w-auto"
          >
            List View
          </Button>
          <Button
            type="default"
            onClick={() => setViewMode('grid')}
            icon={<AppstoreOutlined />}
            className="w-full lg:w-auto"
          >
            Grid View
          </Button>
        </div>

        {/* Search and Create Permission */}
        <div className="flex flex-col lg:flex-row gap-2 w-full">
          <Input
            placeholder="Search permissions..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            allowClear
            className="w-full lg:w-64"
          />
          {hasPermission("Create Permissions") &&
          <Button
            type="primary"
            onClick={handleCreateModalOpen}
            className="w-full lg:w-auto"
          >
            Create Permission
          </Button>
          }
        </div>
      </div>
    </div>
  );
}

export default PermissionsControlBar;