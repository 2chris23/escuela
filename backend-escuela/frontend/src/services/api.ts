import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Usa el proxy configurado en vite.config.ts
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Token encontrado:', token ? 'Sí' : 'No');
    
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Headers configurados:', config.headers);
    }
    return config;
  },
  (error) => {
    console.error('Error en el interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la respuesta:', error.response?.status, error.response?.data);
    
    if (error.response?.status === 401) {
      // Limpiar el token y redirigir al login
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Nota: No se puede usar useAuth hook fuera de componentes React, por lo que no se puede llamar refreshAccessToken aquí directamente.
// Se recomienda manejar la renovación del token en un nivel superior o con otro mecanismo.

export default api; // Exportar la instancia configurada
