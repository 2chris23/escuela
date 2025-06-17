import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares/validation.middleware.js';
import * as adminController from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';

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
router.post('/', authMiddleware, authorize('admin'), validate(createAdminSchema), adminController.register);
// Listar todos los administradores
router.get('/', authMiddleware, authorize('admin'), adminController.obtenerAdmins);

// Dashboard de admin (debe ir antes de las rutas con :id)
router.get('/dashboard', authMiddleware, authorize('admin'), (req, res) => {
  try {
    console.log('DASHBOARD req.user:', req.user);
    // Respuesta segura y a prueba de errores
    if (!req.user || !req.user.userId || !req.user.rol) {
      return res.status(401).json({ message: 'Usuario no autenticado.' });
    }
    // Devolver solo los datos básicos
    return res.status(200).json({
      message: 'Bienvenido al dashboard de admin',
      user: {
        userId: req.user.userId,
        rol: req.user.rol
      }
    });
  } catch (error) {
    console.error('Error en dashboard:', error, req.user);
    return res.status(500).json({ message: 'Error al obtener el dashboard.' });
  }
});

// Obtener un administrador por ID
router.get('/:id', authMiddleware, authorize('admin'), adminController.obtenerAdminPorId);
// Actualizar un administrador
router.put('/:id', authMiddleware, authorize('admin'), validate(updateAdminSchema), adminController.actualizarAdmin);
// Eliminar un administrador
router.delete('/:id', authMiddleware, authorize('admin'), adminController.eliminarAdmin);

// Ejemplo: gestión de usuarios
router.get('/usuarios', authMiddleware, authorize('admin'), adminController.listarUsuarios);

// Puedes agregar más endpoints según lo que necesites para admin

export default router;
