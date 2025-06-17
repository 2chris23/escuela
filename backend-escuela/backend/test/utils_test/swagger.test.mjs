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
  },
  apis: ['./src/routes/*.js'],
};

export default swaggerJsdoc(options);

test('Swagger setup should be defined', () => {
  expect(swaggerJsdoc).toBeDefined();
});