import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares/validation.middleware.js';
import * as profesorController from '../controllers/profesor.controller.js';
import { registerSchema, loginSchema } from '../validations/userSchemas.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * Esquema para crear un profesor
 */
// const createProfesorSchema = z.object({ // Eliminar o comentar este esquema viejo
//   usuarioId: z
//     .number()
//     .int()
//     .positive('El usuarioId debe ser un número positivo'),
// });

/**
 * @openapi
 * /api/profesores:
 *   post:
 *     summary: Crear un nuevo profesor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterSchema'
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos (nombre, email, password obligatorios)
 *       409:
 *         description: El correo electrónico ya está registrado
 *       500:
 *         description: Error al crear el profesor
 */
router.post(
  '/',
  validate(registerSchema),
  profesorController.crearProfesor
);

/**
 * @openapi
 * /api/profesores:
 *   get:
 *     summary: Obtener todos los profesores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de profesores obtenida exitosamente
 *       403:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener los profesores
 */
router.get('/', authMiddleware, authorize('ver_profesores'), profesorController.obtenerProfesores);

/**
 * @openapi
 * /api/profesores/{id}:
 *   get:
 *     summary: Obtener un profesor por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del profesor a obtener
 *     responses:
 *       200:
 *         description: Profesor obtenido exitosamente
 *       403:
 *         description: No autorizado
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al obtener el profesor
 */
router.get('/:id', authMiddleware, authorize('ver_profesor'), profesorController.obtenerProfesorPorId);

/**
 * Esquema para actualizar un profesor
 */
const updateProfesorSchema = z.object({
  usuarioId: z
    .number()
    .int()
    .positive('El usuarioId debe ser un número positivo')
    .optional(),
});

/**
 * @openapi
 * /api/profesores/{id}:
 *   put:
 *     summary: Actualizar un profesor por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del profesor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Profesor actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al actualizar el profesor
 */
router.put(
  '/:id',
  validate(updateProfesorSchema),
  profesorController.actualizarProfesor
);

/**
 * @openapi
 * /api/profesores/{id}:
 *   delete:
 *     summary: Eliminar un profesor por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del profesor a eliminar
 *     responses:
 *       200:
 *         description: Profesor eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: No tiene permiso para eliminar profesores
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al eliminar el profesor
 */
router.delete('/:id', authMiddleware, authorize('eliminar_profesor'), profesorController.eliminarProfesor);

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
router.post('/register', validate(registerSchema), profesorController.register);

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
router.post('/login', validate(loginSchema), profesorController.login);

export default router;