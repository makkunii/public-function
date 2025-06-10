// src/services/permissionsService.js
import api from './api';

const PermissionsService = {
  getAllPermissions: async (params = {}) => {
    try {
      const response = await api.get('/api/permissions', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching permissions:', error);
      throw error;
    }
  },

  createPermission: async (PermissionData) => {
    try {
      const response = await api.post('/api/permissions', PermissionData);
      return response.data;
    } catch (error) {
      console.error('Error creating permission:', error);
      throw error;
    }
  },

  deletePermission: async (id, tenantKey) => {
  try {
    const response = await api.delete(`/api/permissions/${id}`, {
      params: {
        tenant_key: tenantKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting permission with ID ${id}:`, error);
    throw error;
  }
},

  updatePermission: async (id, PermissionData) => {
    try {
      const response = await api.put(`api/permissions/${id}`, PermissionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating permission with ID ${id}:`, error);
      throw error;
    }
  },

  getPermissionsByRole: async (roleId, tenant_key) => {
    const res = await api.get(`/api/role-permissions/${roleId}`, {
      params: { tenant_key },
    });
    return res.data;
  },

  assignPermission: async ({ role_id, permission_id, tenant_key }) => {
    return api.post('/api/role-permissions/assign', {
      role_id,
      permission_id,
      tenant_key,
    });
  },


  removePermission: async ({ role_id, permission_id, tenant_key }) => {
    return api.post('/api/role-permissions/remove', {
      role_id,
      permission_id,
      tenant_key,
    });
  },

  getModules: async ({ tenant_key }) => {
    const res = await api.get('/api/modules', {
      params: { tenant_key },
    });
    return res.data;
  },

  getPermissionsByModule: async (module, tenant_key) => {
    const res = await api.get('/api/permissions/by-module', {
      params: { module, tenant_key },
    });
    return res.data;
  },

    assign: async ({ user_id, permission_id, tenant_key }) => {
    return api.post('/api/user-permissions/assign', {
      user_id,
      permission_id,
      tenant_key,
    });
  },

  remove: async ({ user_id, permission_id, tenant_key }) => {
    return api.post('/api/user-permissions/remove', {
      user_id,
      permission_id,
      tenant_key,
    });
  },

  userPermission: async (user_id, tenant_key) => {
    const res = await api.get(`/api/user-permissions/${user_id}`, {
      params: { tenant_key },
    });
    return res.data;
  },
};

export default PermissionsService;