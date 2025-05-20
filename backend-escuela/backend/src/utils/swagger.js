import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Escuela',
      version: '1.0.0',
      description: 'Documentación de la API del sistema académico para la gestión de usuarios, roles, permisos, aulas y más.',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'soporte@escuela.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.escuela.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Asistencia: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'ID del registro de asistencia.',
            },
            alumnoId: {
              type: 'integer',
              description: 'ID del alumno.',
            },
            claseId: {
              type: 'integer',
              description: 'ID de la clase.',
            },
            fecha: {
              type: 'string',
              format: 'date',
              description: 'Fecha de la asistencia (YYYY-MM-DD).',
            },
            hora: {
              type: 'string',
              format: 'time',
              description: 'Hora de la asistencia (HH:MM:SS).',
            },
            estado: {
              type: 'string',
              enum: ['PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO'],
              description: 'Estado de la asistencia.',
            },
            observaciones: {
              type: 'string',
              description: 'Observaciones sobre la asistencia.',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);