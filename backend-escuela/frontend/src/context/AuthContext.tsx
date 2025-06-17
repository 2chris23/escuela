import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types'; // Importar el tipo User compartido
import api from '../services/api'; // Corrige la ruta de importación de Axios

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permisos: string[]; // Añadir estado para permisos
  login: (user: User, token: string, refreshToken: string, persist: boolean) => void;
  logout: () => void;
  getToken: () => string | null;
  refreshAccessToken: () => Promise<boolean>;
  loading: boolean; // Añadir estado de loading
}

// 1. Definición del contexto y hook para uso global
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
export const useAuth = () => useContext(AuthContext);

// 2. Provider que maneja el estado global de autenticación
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [permisos, setPermisos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true); // Estado de loading

  // Integración de api.defaults.headers.common para el token
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
    setLoading(false); // Actualizar loading a false después de intentar recuperar el token
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');

    async function checkAndRefreshToken() {
      if (storedUser && storedToken && storedRefreshToken) {
        try {
          const decoded = parseJwt(storedToken);
          const now = Math.floor(Date.now() / 1000);
          if (decoded && decoded.exp && decoded.exp < now) {
            // Token expirado, intenta refrescar
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              setUser(JSON.parse(storedUser));
              setRefreshToken(storedRefreshToken);
            } else {
              logout();
            }
          } else {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
            setRefreshToken(storedRefreshToken);
            if (decoded && decoded.permisos) {
              setPermisos(decoded.permisos);
            }
          }
        } catch (error) {
          console.error('Error parsing stored user, token or refreshToken:', error);
          localStorage.removeItem('user');
          sessionStorage.removeItem('user');
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          sessionStorage.removeItem('refreshToken');
        }
      }
    }
    checkAndRefreshToken();

    const timeout = setTimeout(() => {
      if (sessionStorage.getItem('user') && !localStorage.getItem('user')) {
        logout();
      }
    }, 3 * 60 * 1000);
    return () => clearTimeout(timeout);
  }, []);

  // En login, setea el header global de axios
  const login = (user: User, token: string, refreshToken: string, persist: boolean) => {
    if (persist) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('refreshToken', refreshToken);
    }
    setUser(user);
    setToken(token);
    setRefreshToken(refreshToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const decoded = parseJwt(token);
    if (decoded && decoded.permisos) {
      setPermisos(decoded.permisos);
    }
  };

  // En logout, elimina el header global de axios
  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('refreshToken');
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    setPermisos([]);
    delete api.defaults.headers.common['Authorization'];
  };

  const getToken = () => token;

  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) {
      logout();
      return false;
    }
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        logout();
        return false;
      }
      const data = await response.json();
      setToken(data.token);
      if (localStorage.getItem('token')) {
        localStorage.setItem('token', data.token);
      }
      if (sessionStorage.getItem('token')) {
        sessionStorage.setItem('token', data.token);
      }

      const decoded = parseJwt(data.token);
      if (decoded && decoded.permisos) {
        setPermisos(decoded.permisos);
      }

      return true;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, permisos, login, logout, getToken, refreshAccessToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}
