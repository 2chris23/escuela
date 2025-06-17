import api from './api'; // Importar la instancia configurada de Axios
import { Alumno, Profesor, Aula, AulaDetalle } from '@/types'; // Importar desde el archivo de tipos compartidos, incluyendo Aula y AulaDetalle

// Definición de tipos para Aulas (puedes mover estos también a types/index.ts si quieres centralizarlos)
// interface Aula { // Eliminar estas definiciones locales
//   id: string;
//   nombre: string;
//   capacidad: number;
//   // Añadir más campos si es necesario
// }

// interface AulaDetalle extends Aula { // Eliminar estas definiciones locales
//   profesor: Profesor | null;
//   alumnos: Alumno[];
// }

interface CreateAulaData {
    nombre: string;
    capacidad: number;
}

interface AddAlumnoToAulaData {
    nombre: string;
    email: string;
    password: string;
}

// No necesitamos API_URL aquí porque está configurado en la instancia `api`
// const API_URL = '/api';

// Función para obtener todas las aulas
export const getAulas = async (): Promise<Aula[]> => {
  try {
    // La URL base ya está configurada con el proxy en vite.config.ts, así que usamos rutas relativas /api/*
    const response = await api.get<{
      message: string;
      data: Aula[];
    }>(`/aulas`);
    return response.data.data; // Acceder al array dentro de la propiedad 'data'
  } catch (error: any) {
    console.error('Error calling getAulas API:', error);
    // Axios errors tienen una estructura diferente, intentamos obtener el mensaje del backend
    if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
    } else {
        throw new Error('Error al obtener las aulas');
    }
  }
};

// Función para crear una nueva aula
export const createAula = async (aulaData: CreateAulaData): Promise<Aula> => {
    try {
        const response = await api.post<Aula>('/aulas', aulaData); // Usar api.post
        return response.data;
    } catch (error: any) {
        console.error('Error calling createAula API:', error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al crear aula');
        }
    }
};

// Función para obtener el detalle de una aula
export const getAulaDetalle = async (id: string): Promise<AulaDetalle> => {
    try {
        const response = await api.get<{
          message: string;
          data: AulaDetalle; // Esperamos un objeto AulaDetalle dentro de 'data'
        }>(`/aulas/${id}`);
        return response.data.data; // Acceder al objeto de detalle dentro de la propiedad 'data'
    } catch (error: any) {
        console.error(`Error calling getAulaDetalle API for id ${id}:`, error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al obtener detalle de aula');
        }
    }
};

// Función para agregar un alumno a un aula
export const addAlumnoToAula = async (aulaId: string, alumnoData: AddAlumnoToAulaData): Promise<Alumno> => {
    try {
        const response = await api.post<Alumno>(`/aulas/${aulaId}/alumnos`, alumnoData); // Usar api.post
        return response.data;
    } catch (error: any) {
        console.error(`Error calling addAlumnoToAula API for aula ${aulaId}:`, error);
        if (error.response && error.response.status === 409 && error.response.data && error.response.data.data) {
            // Si el backend devuelve el alumno existente en data
            return error.response.data.data;
        }
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al agregar alumno al aula');
        }
    }
};

// Función para eliminar un aula
export const deleteAula = async (id: string): Promise<void> => {
    try {
        await api.delete(`/aulas/${id}`); // Usar api.delete
        // Axios para DELETE sin cuerpo de respuesta exitosa no necesita .data
    } catch (error: any) {
        console.error(`Error calling deleteAula API for id ${id}:`, error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al eliminar aula');
        }
    }
};

// Función para eliminar un alumno de un aula
export const deleteAlumnoFromAula = async (aulaId: string, alumnoId: string): Promise<void> => {
     try {
        await api.delete(`/aulas/${aulaId}/alumnos/${alumnoId}`); // Usar api.delete
     } catch (error: any) {
        console.error(`Error calling deleteAlumnoFromAula API for aula ${aulaId}, alumno ${alumnoId}:`, error);
         if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error('Error al eliminar alumno del aula');
        }
    }
};