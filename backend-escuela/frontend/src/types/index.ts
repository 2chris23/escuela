export interface Alumno {
  id: string;
  nombre: string;
  email?: string; // Añadir otros campos si es necesario
  usuario?: User; // Añadir propiedad usuario al tipo Alumno
}

export interface Profesor {
  id: string;
  nombre: string;
  email?: string; // Añadir otros campos si es necesario
  usuario?: User; // Añadir propiedad usuario al tipo Profesor
}

export interface User {
  id: string;
  role: string;
  nombre?: string; // Añadir propiedad nombre al tipo User
  email?: string; // Añadir email también ya que a veces se necesita
  // Añadir otros campos de usuario si es necesario
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  token: string; // Añadir la propiedad token
  refreshToken: string; // Añadir la propiedad refreshToken
}

// Definición de tipos para Aulas movida desde aulasService.ts
export interface Aula {
  id: string;
  nombre: string;
  capacidad: number;
  // Añadir más campos si es necesario (profesor, alumnos, etc. si se cargan en listas)
}

// Si necesitas una definición de Aula más completa para el detalle
export interface AulaDetalle extends Aula {
  profesor: Profesor | null;
  alumnos: Alumno[];
  // Añadir otras relaciones si es necesario
}