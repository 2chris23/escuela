import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
// import compression from 'compression';
import rateLimitMiddleware from './middlewares/rateLimit.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './utils/swagger.js';

// Rutas
import authRoutes from './routes/auth.routes.js';
import actividadRoutes from './routes/actividad.routes.js';
import alumnoRoutes from './routes/alumno.routes.js';
import profesorRoutes from './routes/profesor.routes.js';
import aulaRoutes from './routes/aula.routes.js';
import tutorRoutes from './routes/tutor.routes.js';
import permisoRoutes from './routes/permiso.routes.js';
import rolRoutes from './routes/rol.routes.js';
import adminRoutes from './routes/admin.routes.js';
import asistenciaRoutes from './routes/asistencia.routes.js'; // Asegúrate de que esta ruta esté importada si la necesitas

// Middlewares personalizados
import authMiddleware from './middlewares/auth.middleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:5173', // URL del frontend de Vite
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Optimizaciones y seguridad
app.use(helmet());
app.use(cors(corsOptions));
// app.use(compression()); // Comprime las respuestas
app.use(express.json({ limit: '10mb' })); // Aumenta el límite de tamaño de JSON
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(rateLimitMiddleware);

// Configuración de caché para respuestas estáticas
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutos de caché para GET
  }
  next();
});

// Swagger UI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Montaje de rutas públicas (sin authMiddleware)
app.use('/api/auth', authRoutes);

// Montaje de rutas protegidas (con authMiddleware)
app.use('/api/actividades', authMiddleware, actividadRoutes);
app.use('/api/alumnos', authMiddleware, alumnoRoutes);
app.use('/api/profesores', authMiddleware, profesorRoutes);
app.use('/api/aulas', authMiddleware, aulaRoutes);
app.use('/api/tutores', authMiddleware, tutorRoutes);
app.use('/api/permisos', authMiddleware, permisoRoutes);
app.use('/api/roles', authMiddleware, rolRoutes);
app.use('/api/admin', authMiddleware, adminRoutes); // Asegúrate que adminRoutes tenga sus propios chequeos de rol 'admin'
app.use('/api/asistencias', authMiddleware, asistenciaRoutes); // Asegúrate que asistenciaRoutes tenga sus propios chequeos de rol 'admin'

// Ruta de prueba protegida (ya tiene authMiddleware)
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Ruta protegida accesible', user: req.user });
});

// Ruta base
app.get('/', (_req, res) => {
  res.send('¡Hola desde el backend de la escuela!');
});

// Manejador de rutas no encontradas
app.use((req, res, next) => { // Añade next para potencialmente pasar a otros middlewares si es necesario
  res.status(404).json({ message: 'Endpoint no encontrado' });
});

// Manejador de errores
app.use(errorHandler);

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log(`Documentación disponible en http://localhost:${port}/api/docs`);
});