import { create } from 'zustand';

const useWorkoutStore = create((set, get) => ({
  workouts: [],
  isLoading: false,
  error: null,
  formData: {
    workoutType: '',
    duration: '',
    intensityLevel: 'medium',
    date: new Date().toISOString().substr(0, 10),
    time: '',
    notes: '',
    caloriesBurn: ''
  },
  
  setField: (name, value) => 
    set((state) => ({
      formData: {
        ...state.formData,
        [name]: name === 'duration' ? parseInt(value, 10) || 0 : value,
        [name]: name === 'caloriesBurn' ? parseInt(value, 10) || 0 : value,
      },
    })),
  
  resetForm: () =>
    set({
      formData: {
        workoutType: '',
        duration: '',
        intensityLevel: 'medium',
        date: new Date().toISOString().substr(0, 10),
        time: '',
        notes: '',
        caloriesBurn: ''
      }
    }),
  
  submitWorkout: async (workoutData) => {
    set({ isLoading: true, error: null });
    try {
      // Ensure duration is properly formatted
      const preparedData = {
        ...workoutData,
        duration: parseInt(workoutData.duration, 10) || 0,
        caloriesBurn: parseInt(workoutData.caloriesBurn, 10) || 0
      };

      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(preparedData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to log workout');
      }
      
      // Update state with the new workout
      set({
        workouts: [...get().workouts, data.data],
        isLoading: false
      });
      
      return { success: true, data: data.data };
    } catch (error) {
      console.error('Error adding workout:', error);
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  // Add fetchWorkouts function to get all workouts
  fetchWorkouts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/workouts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch workouts');
      }
      
      set({
        workouts: data.data,
        isLoading: false
      });
      
      return data.data;
    } catch (error) {
      console.error('Error fetching workouts:', error);
      set({ error: error.message, isLoading: false });
      return [];
    }
  }
}));

export default useWorkoutStore;