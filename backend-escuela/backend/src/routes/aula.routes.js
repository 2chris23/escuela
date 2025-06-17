import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares/validation.middleware.js';
import * as aulaController from '../controllers/aula.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';
import { registerSchema } from '../validations/userSchemas.js';

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

/**
 * @openapi
 * /api/aulas/{id}/alumnos:
 *   post:
 *     summary: Agrega un alumno a un aula existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del aula a la que agregar el alumno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterSchema'
 *     responses:
 *       201:
 *         description: Alumno agregado exitosamente al aula
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Aula no encontrada
 *       409:
 *         description: El correo electrónico ya está registrado o el alumno ya está en el aula
 *       500:
 *         description: Error al agregar el alumno al aula
 */
router.post(
  '/:id/alumnos',
  authMiddleware,
  authorize('agregar_alumno_aula'),
  validate(registerSchema),
  aulaController.agregarAlumno
);

/**
 * @openapi
 * /api/aulas/{aulaId}/alumnos/{alumnoId}:
 *   delete:
 *     summary: Elimina un alumno de un aula
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aulaId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID del aula
 *       - in: path
 *         name: alumnoId
 *         required: true
 *         schema:
 *           type: integer
 *           example: 10
 *         description: ID del alumno (entrada en la tabla Alumno) a eliminar del aula
 *     responses:
 *       200:
 *         description: Alumno eliminado exitosamente del aula
 *       404:
 *         description: Aula o alumno no encontrado en esta aula
 *       500:
 *         description: Error al eliminar el alumno del aula
 */
router.delete(
  '/:aulaId/alumnos/:alumnoId',
  authMiddleware,
  authorize('eliminar_alumno_aula'),
  aulaController.eliminarAlumnoDeAula
);

export default router;