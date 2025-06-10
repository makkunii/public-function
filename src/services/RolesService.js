// src/services/rolesService.js
import api from './api';

const RolesService = {
  getAllRoles: async (params = {}) => {
    try {
      const response = await api.get('/api/roles', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  createRole: async (RoleData) => {
    try {
      const response = await api.post('/api/roles', RoleData);
      return response.data;
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  },

  deleteRole: async (id, tenantKey) => {
  try {
    const response = await api.delete(`/api/roles/${id}`, {
      params: {
        tenant_key: tenantKey,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting role with ID ${id}:`, error);
    throw error;
  }
},

  updateRole: async (id, RoleData) => {
    try {
      const response = await api.put(`api/roles/${id}`, RoleData);
      return response.data;
    } catch (error) {
      console.error(`Error updating role with ID ${id}:`, error);
      throw error;
    }
  },

  assignRole: async ({ user_id, role_id, tenant_key }) => {
    try {
      const response = await api.post('/api/user-role/assign', {
        user_id,
        role_id,
        tenant_key,
      });
      return response.data;
    } catch (error) {
      console.error('Error assigning role:', error);
      throw error;
    }
  },

  getUserRoles: async (userId, tenant_key) => {
    try {
      const response = await api.get(`/api/user-role/${userId}`, {
        params: { tenant_key },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user roles:', error);
      throw error;
    }
  },

  removeRoleFromUser: async ({ user_id, role_id, tenant_key }) => {
    try {
      const response = await api.post('/api/user-role/remove', {
        user_id,
        role_id,
        tenant_key,
      });
      return response.data;
    } catch (error) {
      console.error('Error removing role from user:', error);
      throw error;
    }
  },
};

export default RolesService;