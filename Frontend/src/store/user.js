import { create } from "zustand";
import api from "../contexts/axois";

const useUserStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  hasLoadedUser: false,

  clearError: () => {
    set({ error: null });
  },

  // Check if user is authenticated on app load
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return set({ isAuthenticated: false, user: null });
    }

    try {
      set({ isLoading: true });

      const response = await api.get("/api/users/me");
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        hasLoadedUser: true
      });
      return true;
    } catch (error) {
      console.log("Relogin User");
      localStorage.removeItem("token");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error.message || 'Authentication failed',
        hasLoadedUser: false
      });
      return false;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/api/login", { email, password });
      
      localStorage.setItem("token", response.data.token);

      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      set({
        isLoading: false,
        error: error.message || "Login failed",
      });
      throw error;
    }
  },

  // Register user
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.post("/api/signup/email", userData);

      // Store token and user
      localStorage.setItem("token", response.data.token);

      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Registration failed",
      });
      throw error;
    }
  },

  // Google authentication
  googleAuth: async (tokenId) => {
    try {
      set({ isLoading: true, error: null });

      localStorage.setItem("token", tokenId);
      const response = await api.post("/api/login");

      // Store token and user
      localStorage.setItem("token", response.data.token);

      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Google authentication failed",
      });
      throw error;
    }
  },

  googleSignUp: async (tokenId) => {
    try {
      set({ isLoading: true, error: null });

      localStorage.setItem("token", tokenId);
      const response = await api.post("/api/signup/google");

      // Store token and user
      localStorage.setItem("token", response.data.token);

      set({
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Google authentication failed",
      });
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    const state = useUserStore.getState();
    if (state.hasLoadedUser && state.user) {
      return state.user;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/api/users/me");
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        hasLoadedUser: true
      });
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Failed to load user data",
        hasLoadedUser: false
      });
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const response = await api.put("/api/users/me", userData);
      
      set({
        user: response.data,
        isLoading: false,
        error: null,
      });
      
      return response.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response?.data?.message || "Profile update failed",
      });
      throw error;
    }
  },
}));

export default useUserStore;
