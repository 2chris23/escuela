import { Router } from 'express';
import validate from '../middlewares/validation.middleware.js';
import * as authController from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validations/userSchemas.js';
import authMiddleware from '../middlewares/auth.middleware.js';

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

/**
 * @openapi
 * /api/auth/profile:
 *   get:
 *     summary: Obtener perfil del usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error al obtener el perfil
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * @openapi
 * /api/auth/profile:
 *   put:
 *     summary: Actualizar perfil del usuario
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - nombre
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al actualizar el perfil
 */
router.put('/profile', authMiddleware, authController.updateProfile);

export default router;