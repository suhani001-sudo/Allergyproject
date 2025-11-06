import api from './api';

// Restaurant Service for CRUD operations
const restaurantService = {
  // Get all restaurants
  getAllRestaurants: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.location) {
        params.append('location', filters.location);
      }
      
      if (filters.allergyFree) {
        params.append('allergyFree', filters.allergyFree);
      }
      
      const queryString = params.toString();
      const url = queryString ? `/restaurants?${queryString}` : '/restaurants';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single restaurant by ID
  getRestaurantById: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new restaurant
  createRestaurant: async (restaurantData) => {
    try {
      const response = await api.post('/restaurants', restaurantData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update restaurant
  updateRestaurant: async (id, restaurantData) => {
    try {
      const response = await api.put(`/restaurants/${id}`, restaurantData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete restaurant
  deleteRestaurant: async (id) => {
    try {
      const response = await api.delete(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change restaurant account password
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/users/change-password', {
        oldPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete restaurant account (user account + profile)
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

export default restaurantService;
