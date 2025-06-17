import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares_test/validation.middleware.test.mjs';
import * as adminController from '../controllers_test/admin.controller.test.mjs';
import authMiddleware from '../middlewares_test/auth.middleware.test.mjs';
import authorize from '../middlewares_test/authorization.middleware.test.mjs';

const router = Router();

// Esquema para crear un administrador
const createAdminSchema = z.object({
  nombre: z.string().trim().min(3).max(255),
  email: z.string().trim().email().max(255),
  password: z.string().trim().min(6).max(128),
});

// Esquema para actualizar un administrador
const updateAdminSchema = z.object({
  nombre: z.string().trim().min(3).max(255).optional(),
  email: z.string().trim().email().max(255).optional(),
  password: z.string().trim().min(6).max(128).optional(),
});

/**
 * @openapi
 * /admin/register:
 *   post:
 *     summary: Registrar un nuevo administrador
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Administrador creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: El correo electrónico ya está registrado
 *       401:
 *         description: No autorizado
 *
 * /admin:
 *   get:
 *     summary: Listar todos los administradores
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de administradores
 *       401:
 *         description: No autorizado
 *
 * /admin/{id}:
 *   get:
 *     summary: Obtener un administrador por ID
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Administrador encontrado
 *       404:
 *         description: Administrador no encontrado
 *       401:
 *         description: No autorizado
 *   put:
 *     summary: Actualizar un administrador
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Administrador actualizado
 *       404:
 *         description: Administrador no encontrado
 *       401:
 *         description: No autorizado
 *   delete:
 *     summary: Eliminar un administrador
 *     tags:
 *       - Administradores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del administrador
 *     responses:
 *       200:
 *         description: Administrador eliminado exitosamente
 *       404:
 *         description: Administrador no encontrado
 *       401:
 *         description: No autorizado
 */

// Registrar un nuevo administrador
router.post('/register', authMiddleware, authorize('admin'), validate(createAdminSchema), adminController.register);
// Listar todos los administradores
router.get('/', authMiddleware, authorize('admin'), adminController.obtenerAdmins);
// Obtener un administrador por ID
router.get('/:id', authMiddleware, authorize('admin'), adminController.obtenerAdminPorId);
// Actualizar un administrador
router.put('/:id', authMiddleware, authorize('admin'), validate(updateAdminSchema), adminController.actualizarAdmin);
// Eliminar un administrador
router.delete('/:id', authMiddleware, authorize('admin'), adminController.eliminarAdmin);

// Dashboard de admin
router.get('/dashboard', authMiddleware, authorize('admin'), adminController.dashboard);

// Ejemplo: gestión de usuarios
router.get('/usuarios', authMiddleware, authorize('admin'), adminController.listarUsuarios);

// Puedes agregar más endpoints según lo que necesites para admin

export default router;
