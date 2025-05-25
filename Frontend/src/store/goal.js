import { create } from 'zustand';
import axios from 'axios';

// Configure axios to use auth token for all requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

const useGoalStore = create((set) => ({
  goals: [],
  loading: false,
  error: null,
  
  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('/api/goals');
      set({ goals: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch goals',
        loading: false
      });
      throw error;
    }
  },
  
  createGoal: async (goalData) => {
    try {
      const response = await axios.post('/api/goals', goalData);
      
      set((state) => ({
        goals: [response.data, ...state.goals]
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create goal' });
      throw error;
    }
  },
  
  updateGoal: async (id, currentValue) => {
    try {
      const response = await axios.put(`/api/goals/${id}`, { currentValue });
      
      set((state) => ({
        goals: state.goals.map(goal => 
          goal._id === id ? response.data : goal
        )
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update goal' });
      throw error;
    }
  },
  
  deleteGoal: async (id) => {
    try {
      await axios.delete(`/api/goals/${id}`);
      
      set((state) => ({
        goals: state.goals.filter(goal => goal._id !== id)
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete goal' });
      throw error;
    }
  }
}));

export default useGoalStore;