import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token automáticamente a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes personalizar el manejo global de errores
    if (error.response && error.response.data && error.response.data.message) {
      // Puedes mostrar un toast o loguear el error
      console.error('API error:', error.response.data.message);
    }
    return Promise.reject(error);
  }
);

export default api;
