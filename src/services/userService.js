import api from './api';

// User Service for profile management
const userService = {
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/users/profile', profileData);
      
      // Update stored user data
      if (response.data.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user dashboard stats
  getStats: async () => {
    try {
      const response = await api.get('/users/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID with allergies
  getUserById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user account
  deleteAccount: async () => {
    try {
      const response = await api.delete('/users/account');
      
      // Clear all stored data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('role');
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
