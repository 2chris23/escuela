import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares_test/validation.middleware.test.mjs';
import * as aulaController from '../controllers_test/aula.controller.test.mjs';
import authMiddleware from '../middlewares_test/auth.middleware.test.mjs';
import authorize from '../middlewares_test/authorization.middleware.test.mjs';

const router = Router();

/**
 * Esquema para crear un aula
 */
const createAulaSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(255, 'El nombre no puede exceder 255 caracteres'),
  descripcion: z.string().trim().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  profesorId: z.number().int().positive('El profesorId debe ser un número positivo'),
});

/**
 * Esquema para actualizar un aula
 */
const updateAulaSchema = z.object({
  nombre: z.string().trim().min(1).max(255).optional(),
  descripcion: z.string().trim().max(500).optional(),
  profesorId: z.number().int().positive().optional(),
});

/**
 * @openapi
 * /api/aulas:
 *   post:
 *     summary: Crear una nueva aula
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
 *                 example: "Aula de Matemáticas"
 *               descripcion:
 *                 type: string
 *                 example: "Aula para clases de álgebra y geometría"
 *               profesorId:
 *                 type: integer
 *                 example: 123
 *             required:
 *               - nombre
 *               - profesorId
 *     responses:
 *       201:
 *         description: Aula creada
 *       403:
 *         description: No autorizado
 */
router.post('/', authMiddleware, authorize('crear_aula'), validate(createAulaSchema), aulaController.crearAula);

/**
 * @openapi
 * /api/aulas:
 *   get:
 *     summary: Obtener todas las aulas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de aulas
 *       403:
 *         description: No autorizado
 */
router.get('/', authMiddleware, authorize('ver_aulas'), aulaController.obtenerAulas);

/**
 * @openapi
 * /api/aulas/{id}:
 *   get:
 *     summary: Obtener un aula por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del aula a obtener
 *     responses:
 *       200:
 *         description: Aula obtenida
 *       404:
 *         description: Aula no encontrada
 *       403:
 *         description: No autorizado
 */
router.get('/:id', authMiddleware, authorize('ver_aula'), aulaController.obtenerAulaPorId);

/**
 * @openapi
 * /api/aulas/{id}:
 *   put:
 *     summary: Actualizar un aula por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del aula a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Aula de Ciencias"
 *               descripcion:
 *                 type: string
 *                 example: "Aula para experimentos de física y química"
 *               profesorId:
 *                 type: integer
 *                 example: 456
 *     responses:
 *       200:
 *         description: Aula actualizada
 *       404:
 *         description: Aula no encontrada
 *       403:
 *         description: No autorizado
 */
router.put('/:id', authMiddleware, authorize('actualizar_aula'), validate(updateAulaSchema), aulaController.actualizarAula);

/**
 * @openapi
 * /api/aulas/{id}:
 *   delete:
 *     summary: Eliminar un aula por su ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del aula a eliminar
 *     responses:
 *       200:
 *         description: Aula eliminada
 *       404:
 *         description: Aula no encontrada
 *       403:
 *         description: No autorizado
 */
router.delete('/:id', authMiddleware, authorize('eliminar_aula'), aulaController.eliminarAula);

export default router;