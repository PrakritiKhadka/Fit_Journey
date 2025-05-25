import React, { createContext, useEffect, useState } from 'react';
import useUserStore from '../store/user.js';

// Create the context with a default value
export const AuthContext = createContext({
  isInitializing: true,
  isAuthenticated: false,
  user: null
});

// Export the provider component as the default export
const AuthProvider = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, user, checkAuth, error } = useUserStore();
  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        console.error('Auth initialization error:', error);
        // If token validation fails, we'll end up here
        // User store should already handle clearing invalid tokens
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeAuth();
  }, [checkAuth]);
  
  return (
    <AuthContext.Provider value={{ 
      isInitializing, 
      isAuthenticated, 
      user,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;