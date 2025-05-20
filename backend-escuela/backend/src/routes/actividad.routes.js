import { Router } from 'express';
import validate from '../middlewares/validation.middleware.js';
import * as authController from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validations/userSchemas.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';
import * as actividadController from '../controllers/actividad.controller.js';
import { z } from 'zod';

const router = Router();

const createActividadSchema = z.object({
  titulo: z.string().min(3),
  descripcion: z.string().optional(),
  fechaEntrega: z.string().optional(),
  profesorId: z.number().int(),
  aulaId: z.number().int(),
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

/**
 * @openapi
 * /api/actividades:
 *   post:
 *     summary: Crear una nueva actividad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 3
 *               descripcion:
 *                 type: string
 *               fechaEntrega:
 *                 type: string
 *               profesorId:
 *                 type: integer
 *               aulaId:
 *                 type: integer
 *             required:
 *               - titulo
 *               - profesorId
 *               - aulaId
 *     responses:
 *       201:
 *         description: Actividad creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       403:
 *         description: No autorizado para crear actividades
 *       500:
 *         description: Error al crear la actividad
 */
router.post('/', authMiddleware, authorize('crear_actividad'), validate(createActividadSchema), actividadController.crearActividad);

/**
 * @openapi
 * /api/actividades:
 *   get:
 *     summary: Listar todas las actividades
 *     responses:
 *       200:
 *         description: Lista de actividades obtenida exitosamente
 *       403:
 *         description: No autorizado para ver actividades
 *       500:
 *         description: Error al obtener las actividades
 */
router.get('/', authMiddleware, authorize('ver_actividades'), actividadController.obtenerActividades);

/**
 * @openapi
 * /api/actividades/{id}:
 *   get:
 *     summary: Obtener una actividad por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad obtenida exitosamente
 *       403:
 *         description: No autorizado para ver actividades
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error al obtener la actividad
 */
router.get('/:id', authMiddleware, authorize('ver_actividades'), actividadController.obtenerActividadPorId);

/**
 * @openapi
 * /api/actividades/{id}:
 *   put:
 *     summary: Actualizar una actividad por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 minLength: 3
 *               descripcion:
 *                 type: string
 *               fechaEntrega:
 *                 type: string
 *               profesorId:
 *                 type: integer
 *               aulaId:
 *                 type: integer
 *             required:
 *               - titulo
 *               - profesorId
 *               - aulaId
 *     responses:
 *       200:
 *         description: Actividad actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       403:
 *         description: No autorizado para actualizar actividades
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error al actualizar la actividad
 */
router.put('/:id', authMiddleware, authorize('actualizar_actividad'), validate(createActividadSchema), actividadController.actualizarActividad);

/**
 * @openapi
 * /api/actividades/{id}:
 *   delete:
 *     summary: Eliminar una actividad por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Actividad eliminada exitosamente
 *       403:
 *         description: No autorizado para eliminar actividades
 *       404:
 *         description: Actividad no encontrada
 *       500:
 *         description: Error al eliminar la actividad
 */
router.delete('/:id', authMiddleware, authorize('eliminar_actividad'), actividadController.eliminarActividad);

export default router;