import api from './api'; // Importar la instancia configurada de Axios
import { Alumno, User } from '@/types'; // Importar tipos compartidos

// Definición de tipos específicos para alumnos (si no están ya en types/index.ts)
// interface Alumno { ... }

interface CreateAlumnoData {
    nombre: string;
    email: string;
    password?: string; // La contraseña podría ser opcional si se genera
}

// La URL base ya está configurada con el proxy en vite.config.ts, así que usamos rutas relativas /api/*
// const API_URL = '/api'; // Eliminar si existe

// Función para obtener todos los alumnos (si existe esta ruta)
export const getAlumnos = async (): Promise<Alumno[]> => {
  try {
    const response = await api.get<{
      message: string;
      data: Alumno[];
    }>(`/alumnos`); // Usar la ruta relativa
    return response.data.data; // Acceder al array dentro de la propiedad 'data'
  } catch (error: any) {
    console.error('Error calling getAlumnos API:', error);
     if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
    } else {
        throw new Error('Error al obtener alumnos');
    }
  }
};

// Función para obtener el detalle de un alumno
export const getAlumnoDetalle = async (id: string): Promise<Alumno> => {
    try {
        // Asumiendo que existe una ruta GET /api/alumnos/:id
        const response = await api.get<{
          message: string;
          data: Alumno; // Esperamos un objeto Alumno dentro de 'data'
        }>(`/alumnos/${id}`); // Usar api.get
        console.log("Datos del alumno recibidos:", response.data.data);
        return response.data.data; // Acceder al objeto de detalle dentro de la propiedad 'data'
    } catch (error: any) {
        console.error(`Error calling getAlumnoDetalle API for id ${id}:`, error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al obtener detalle de alumno');
        }
    }
};

// Función para crear un nuevo alumno
export const createAlumno = async (alumnoData: CreateAlumnoData): Promise<Alumno> => {
    try {
        // El backend crea un usuario con rol 'alumno' y asocia los datos del alumno
        // Asegúrate que tu backend maneje la creación de usuario y alumno en esta ruta
        const response = await api.post<Alumno>('/alumnos', alumnoData); // Usar api.post
        return response.data;
    } catch (error: any) {
        console.error('Error calling createAlumno API:', error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al crear alumno');
        }
    }
};

// Función para eliminar un alumno
export const deleteAlumno = async (id: string): Promise<void> => {
     try {
        // Asumiendo que existe una ruta DELETE /api/alumnos/:id
        await api.delete(`/alumnos/${id}`); // Usar api.delete
     } catch (error: any) {
        console.error(`Error calling deleteAlumno API for id ${id}:`, error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al eliminar alumno');
        }
    }
};

// Puedes añadir funciones para actualizar o eliminar alumno si las necesitas
// export const updateAlumno = async (id: string, data: any): Promise<Alumno> => { ... }; 