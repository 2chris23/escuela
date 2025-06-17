import api from './api'; // Importar la instancia configurada de Axios
import { Profesor, User } from '@/types'; // Importar tipos compartidos

// Definición de tipos específicos para profesores (si no están ya en types/index.ts)
// interface Profesor { ... }

interface CreateProfesorData {
    nombre: string;
    email: string;
    password?: string; // La contraseña podría ser opcional si se genera
}

// La URL base ya está configurada con el proxy en vite.config.ts, así que usamos rutas relativas /api/*
// const API_URL = '/api'; // Eliminar esta línea si existe

// Función para obtener todos los profesores
export const getProfesores = async (): Promise<Profesor[]> => {
  try {
    const response = await api.get<{
      message: string;
      data: Profesor[];
    }>(`/profesores`); // Usar la ruta relativa
    return response.data.data; // Acceder al array dentro de la propiedad 'data'
  } catch (error: any) {
    console.error('Error calling getProfesores API:', error);
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else if (error.response.status === 403) {
        throw new Error('No tiene permiso para ver los profesores.');
      } else if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }
    throw new Error('Error al obtener los profesores.');
  }
};

// Función para crear un nuevo profesor
export const createProfesor = async (profesorData: CreateProfesorData): Promise<Profesor> => {
    try {
        // El backend crea un usuario con rol 'profesor' y asocia los datos del profesor
        // Asegúrate que tu backend maneje la creación de usuario y profesor en esta ruta
        const response = await api.post<Profesor>('/profesores', profesorData); // Usar api.post
        return response.data;
    } catch (error: any) {
        console.error('Error calling createProfesor API:', error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al crear profesor');
        }
    }
};

// Función para eliminar un profesor
export const deleteProfesor = async (id: string): Promise<void> => {
     try {
        await api.delete(`/profesores/${id}`); // Usar api.delete
     } catch (error: any) {
        console.error(`Error calling deleteProfesor API for id ${id}:`, error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al eliminar profesor');
        }
    }
};

// Función para obtener el detalle de un profesor
export const getProfesorDetalle = async (id: string): Promise<Profesor> => {
  try {
    // Validate ID is a number
    if (!id || isNaN(Number(id))) {
      throw new Error('ID de profesor inválido');
    }

    const response = await api.get<{ message: string; data: Profesor }>(`/profesores/${id}`);
    
    // Validate response structure
    if (!response.data || !response.data.data) {
      throw new Error('Respuesta del servidor inválida');
    }

    return response.data.data;
  } catch (error: any) {
    console.error(`Error calling getProfesorDetalle API for id ${id}:`, error);
    
    if (error.response) {
      const { status, data } = error.response;
      
      if (status === 401) {
        throw new Error('Sesión expirada. Por favor, inicie sesión nuevamente.');
      } else if (status === 403) {
        throw new Error('No tiene permiso para ver el detalle del profesor.');
      } else if (status === 404) {
        throw new Error('Profesor no encontrado.');
      } else if (status === 400) {
        throw new Error(data.message || 'ID de profesor inválido');
      } else if (status === 500) {
        // Include more detailed error information from the backend
        const errorMessage = data.error || data.message || 'Error al obtener el detalle del profesor';
        throw new Error(errorMessage);
      }
    }
    
    // Handle network errors or other issues
    throw new Error(error.message || 'Error al obtener el detalle del profesor');
  }
};

// Puedes añadir otras funciones de servicio para profesores si es necesaria
// export const updateProfesor = async (id: string, data: Partial<CreateProfesorData>): Promise<Profesor> => { ... };

// Puedes añadir una función para obtener el detalle de un profesor si es necesaria para su perfil
// export const getProfesorDetalle = async (id: string): Promise<ProfesorDetalle> => { ... }; 