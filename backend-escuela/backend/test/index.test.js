import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimitMiddleware from '../src/middlewares/rateLimit.middleware.js';
import errorHandler from '../src/middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from '../src/utils/swagger.js';

// Rutas
import authRoutes from '../src/routes/auth.routes.js';
import actividadRoutes from '../src/routes/actividad.routes.js';
import alumnoRoutes from '../src/routes/alumno.routes.js';
import profesorRoutes from '../src/routes/profesor.routes.js';
import aulaRoutes from '../src/routes/aula.routes.js';
import tutorRoutes from '../src/routes/tutor.routes.js';
import permisoRoutes from '../src/routes/permiso.routes.js';
import rolRoutes from '../src/routes/rol.routes.js';

// Middlewares personalizados
import authMiddleware from '../src/middlewares/auth.middleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Seguridad y logs
app.use(helmet()); // Configuración de seguridad
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Parseo de JSON en las solicitudes
app.use(morgan('dev')); // Logs de solicitudes HTTP
app.use(rateLimitMiddleware); // Límite de solicitudes

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Montaje de rutas
app.use('/api/auth', authRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/alumnos', alumnoRoutes);
app.use('/api/profesores', profesorRoutes);
app.use('/api/aulas', aulaRoutes);
app.use('/api/tutores', tutorRoutes);
app.use('/api/permisos', permisoRoutes);
app.use('/api/roles', rolRoutes);

// Ruta de prueba protegida
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Ruta protegida accesible', user: req.user });
});

// Ruta base
app.get('/', (_req, res) => {
  res.send('¡Hola desde el backend de la escuela!');
});

// Manejador de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Manejador de errores
app.use(errorHandler);

// Exportar la aplicación para pruebas
export default app;

import request from 'supertest';
import app from '../src/index.js';

describe('Pruebas para el servidor principal', () => {
  it('Debe responder con un mensaje en la ruta base', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('¡Hola desde el backend de la escuela!');
  });

  it('Debe devolver un error 404 para rutas no encontradas', async () => {
    const response = await request(app).get('/ruta-inexistente');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Endpoint no encontrado' });
  });

  it('Debe acceder a la ruta protegida con autenticación', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', 'Bearer token-valido'); // Simular un token válido
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Ruta protegida accesible');
  });
});