import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach JWT & Device Certificate token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('panacea_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const certificateKey = localStorage.getItem('panacea_device_cert');
  if (certificateKey) {
    config.headers['x-device-certificate'] = certificateKey;
  }

  return config;
});

// Intercept responses for auth & user-friendly error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('panacea_token');
      localStorage.removeItem('panacea_user');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    // Ensure error.userMessage is always a clean, intuitive string
    let userMessage = 'Unable to complete this action right now. Please try again.';
    if (error.response?.data?.message && typeof error.response.data.message === 'string') {
      userMessage = error.response.data.message;
    } else if (error.code === 'ERR_NETWORK') {
      userMessage = 'Server is currently unreachable. Please check your network connection.';
    } else if (error.response?.status === 403) {
      userMessage = 'You do not have permission to perform this action.';
    } else if (error.response?.status === 404) {
      userMessage = 'The requested item or information was not found.';
    }

    if (error.response?.data) {
      error.response.data.message = userMessage;
    }

    return Promise.reject(error);
  }
);

export default api;

