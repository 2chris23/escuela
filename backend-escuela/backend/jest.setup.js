// Archivo de configuración para pruebas con Jest
// Puedes agregar aquí configuraciones globales para los tests

import dotenv from 'dotenv';

// Cargar variables de entorno específicas para pruebas
dotenv.config({ path: '.env.test' });

// Configurar NODE_ENV como 'test'
process.env.NODE_ENV = 'test';

// Configurar la URL de la base de datos de prueba
process.env.DATABASE_URL = 'postgresql://test_user:test_password@localhost:5432/test_db';