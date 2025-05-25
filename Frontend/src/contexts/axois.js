import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.BACKEND_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error('Response error:', error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
      
      const errorMessage = error.response.data.message || 'An error occurred';
      error.message = errorMessage;
    } else if (error.request) {
      console.error('Request error:', error.request);
      error.message = 'Server is not responding. Please try again later.';
    } else {
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;