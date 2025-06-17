import axios from 'axios';
import { LoginCredentials, LoginResponse, User } from '@/types'; // Importar tipos compartidos

// La URL base ya está configurada con el proxy en vite.config.ts, así que usamos rutas relativas /api/*
const API_URL = '/api';

export const loginUser = async (credentials: LoginCredentials): Promise<{ token: string; refreshToken: string; user: User }> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
    const fullData = response.data;
    const token = fullData.token;
    const refreshToken = fullData.refreshToken;
    // Construimos el usuario sin el token ni refreshToken
    const { token: _, refreshToken: __, ...user } = fullData;
    return { token, refreshToken, user };
  } catch (error: any) {
    console.error('Error calling login API:', error);
    // Axios errors tienen una estructura diferente, intentamos obtener el mensaje del backend
    if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
    } else {
        throw new Error('Error en el inicio de sesión');
    }
  }
};

// Puedes añadir otras funciones relacionadas con autenticación aquí (ej: logout, register, etc.)