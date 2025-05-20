import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares_test/validation.middleware.test.mjs';
import * as rolController from '../controllers_test/rol.controller.test.mjs';
import authMiddleware from '../middlewares_test/auth.middleware.test.mjs';
import authorize from '../middlewares_test/authorization.middleware.test.mjs';

const router = Router();

/**
 * Esquema para crear un rol
 */
const createRolSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
});

/**
 * Esquema para actualizar un rol
 */
const updateRolSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio')
    .max(255, 'El nombre no puede exceder 255 caracteres'),
});

/**
 * Esquema para asignar permisos a un rol
 */
const asignarPermisosARolSchema = z.object({
  permisos: z
    .array(z.number().positive('El ID del permiso debe ser un número positivo')),
});

/**
 * @openapi
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
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
 *                 example: "Administrador"
 *             required:
 *               - nombre
 *     responses:
 *       201:
 *         description: Rol creado exitosamente
 *       403:
 *         description: No autorizado
 */
router.post(
  '/',
  authMiddleware,
  authorize('crear_rol'),
  validate(createRolSchema),
  rolController.crearRol
);

/**
 * @openapi
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles obtenida exitosamente
 *       403:
 *         description: No autorizado
 */
router.get(
  '/',
  authMiddleware,
  authorize('ver_roles'),
  rolController.obtenerRoles
);

/**
 * @openapi
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del rol a obtener
 *     responses:
 *       200:
 *         description: Rol obtenido exitosamente
 *       404:
 *         description: Rol no encontrado
 *       403:
 *         description: No autorizado
 */
router.get(
  '/:id',
  authMiddleware,
  authorize('ver_rol'),
  rolController.obtenerRolPorId
);

/**
 * @openapi
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar un rol por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Editor"
 *             required:
 *               - nombre
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       403:
 *         description: No autorizado
 */
router.put(
  '/:id',
  authMiddleware,
  authorize('actualizar_rol'),
  validate(updateRolSchema),
  rolController.actualizarRol
);

/**
 * @openapi
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado exitosamente
 *       404:
 *         description: Rol no encontrado
 *       403:
 *         description: No autorizado
 */
router.delete(
  '/:id',
  authMiddleware,
  authorize('eliminar_rol'),
  rolController.eliminarRol
);

/**
 * @openapi
 * /api/roles/{id}/permisos:
 *   post:
 *     summary: Asignar permisos a un rol
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del rol al que se asignarán los permisos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permisos:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *             required:
 *               - permisos
 *     responses:
 *       200:
 *         description: Permisos asignados exitosamente
 *       404:
 *         description: Rol no encontrado
 *       403:
 *         description: No autorizado
 */
router.post(
  '/:id/permisos',
  authMiddleware,
  authorize('asignar_permisos_a_rol'),
  validate(asignarPermisosARolSchema),
  rolController.asignarPermisosARol
);

export default router;