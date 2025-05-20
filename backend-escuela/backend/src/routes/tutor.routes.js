import { Router } from 'express';
import validate from '../middlewares/validation.middleware.js';
import * as authController from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validations/userSchemas.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';
import * as tutorController from '../controllers/tutor.controller.js';
import { z } from 'zod';

const router = Router();

const createTutorSchema = z.object({
  usuarioId: z.number().int().positive('El usuarioId debe ser un número positivo'),
});

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

// Crear tutor desde admin
router.post('/', authMiddleware, authorize('admin'), validate(createTutorSchema), tutorController.crearTutor);
// Listar todos los tutores
router.get('/', authMiddleware, authorize('admin'), tutorController.obtenerTutores);
// Obtener tutor por ID
router.get('/:id', authMiddleware, authorize('admin'), tutorController.obtenerTutorPorId);
// Actualizar tutor
router.put('/:id', authMiddleware, authorize('admin'), validate(createTutorSchema), tutorController.actualizarTutor);
// Eliminar tutor
router.delete('/:id', authMiddleware, authorize('admin'), tutorController.eliminarTutor);

export default router;