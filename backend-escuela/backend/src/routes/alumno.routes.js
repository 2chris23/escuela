import { Router } from 'express';
import validate from '../middlewares/validation.middleware.js';
import * as authController from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validations/userSchemas.js';
import * as alumnoController from '../controllers/alumno.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 255
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 128
 *             required:
 *               - nombre
 *               - email
 *               - password
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       409:
 *         description: El correo electrónico ya está registrado
 *       500:
 *         description: Error al registrar el usuario
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: El correo electrónico y la contraseña son obligatorios
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error al iniciar sesión
 */
router.post('/login', validate(loginSchema), authController.login);

// CRUD de alumnos para uso administrativo
router.post('/', authMiddleware, authorize('admin'), alumnoController.crearAlumno);
router.get('/', authMiddleware, authorize('admin'), alumnoController.obtenerAlumnos);
router.get('/:id', authMiddleware, authorize('admin'), alumnoController.obtenerAlumnoPorId);
router.put('/:id', authMiddleware, authorize('admin'), alumnoController.actualizarAlumno);
router.delete('/:id', authMiddleware, authorize('admin'), alumnoController.eliminarAlumno);

export default router;