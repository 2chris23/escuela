import { useState } from 'react';
import api from './api';

// Hook genérico para peticiones API
export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Método para hacer peticiones
  const request = async <T = any>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await api({ method, url, data });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de red');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { request, loading, error };
}
