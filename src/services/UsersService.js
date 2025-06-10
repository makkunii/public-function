// src/services/usersService.js
import api from './api';

const UsersService = {
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/api/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  createUser: async (UserData) => {
    try {
      const response = await api.post('/api/users', UserData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  deleteUser: async (id, tenantKey) => {
    try {
      const response = await api.delete(`/api/users/${id}`, {
            params: {
              tenant_key: tenantKey,
            },
          });
      return response.data;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  },

  updateUser: async (id, UserData) => {
    try {
      const response = await api.put(`api/users/${id}`, UserData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  },
};

export default UsersService;