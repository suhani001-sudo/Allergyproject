import api from './api';

// Allergy Service for CRUD operations
const allergyService = {
  // Get all allergies for current user
  getAllergies: async () => {
    try {
      const response = await api.get('/allergies');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single allergy by ID
  getAllergyById: async (id) => {
    try {
      const response = await api.get(`/allergies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new allergy record
  createAllergy: async (allergyData) => {
    try {
      const response = await api.post('/allergies', allergyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update allergy record
  updateAllergy: async (id, allergyData) => {
    try {
      const response = await api.put(`/allergies/${id}`, allergyData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete allergy record
  deleteAllergy: async (id) => {
    try {
      const response = await api.delete(`/allergies/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default allergyService;
