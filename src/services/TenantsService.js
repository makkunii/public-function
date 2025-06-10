// src/services/TenantsService.js
import api from './api';

const TenantsService = {
  getAllTenants: async () => {
    try {
      const response = await api.get('/api/tenants');
      return response.data;
    } catch (error) {
      console.error('Error fetching tenants:', error);
      throw error;
    }
  },

  createTenant: async (tenantData) => {
    try {
      const response = await api.post('/api/tenants', tenantData);
      return response.data;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  },

  deleteTenant: async (id) => {
    try {
      const response = await api.delete(`/api/tenants/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting tenant with ID ${id}:`, error);
      throw error;
    }
  },

   generateKey: async () => {
    try {
      const response = await api.get('/api/tenants/generate-key');
      return response.data;
    } catch (error) {
      console.error('Error Generate tenant key:', error);
      throw error;
    }
  },

  updateTenant: async (id, tenantData) => {
    try {
      const response = await api.put(`api/tenants/${id}`, tenantData);
      return response.data;
    } catch (error) {
      console.error(`Error updating tenant with ID ${id}:`, error);
      throw error;
    }
  },
};

export default TenantsService;