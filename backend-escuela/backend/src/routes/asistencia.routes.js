import { Router } from 'express';
import {
  crearAsistencia,
  obtenerAsistencias,
  obtenerAsistenciaPorId,
  obtenerAsistenciaPorAlumno,
  obtenerAsistenciaPorClase,
  actualizarAsistencia,
  eliminarAsistencia,
} from '../controllers/asistencia.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import authorize from '../middlewares/authorization.middleware.js';

const router = Router();

/**
 * @openapi
 * /asistencia:
 *   post:
 *     summary: Crea un nuevo registro de asistencia.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alumnoId:
 *                 type: integer
 *                 description: ID del alumno.
 *               claseId:
 *                 type: integer
 *                 description: ID de la clase.
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la asistencia (YYYY-MM-DD).
 *               hora:
 *                 type: string
 *                 format: time
 *                 description: Hora de la asistencia (HH:MM:SS).
 *               estado:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO]
 *                 description: Estado de la asistencia.
 *               observaciones:
 *                 type: string
 *                 description: Observaciones sobre la asistencia.
 *             required:
 *               - alumnoId
 *               - claseId
 *               - fecha
 *     responses:
 *       201:
 *         description: Asistencia registrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 data:
 *                   $ref: '#/components/schemas/Asistencia'
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error al registrar la asistencia.
 */
router.post('/asistencia', authMiddleware, authorize('registrar_asistencia'), crearAsistencia);

/**
 * @openapi
 * /asistencia:
 *   get:
 *     summary: Obtiene todos los registros de asistencia.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de asistencias.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asistencia'
 *       500:
 *         description: Error al obtener las asistencias.
 */
router.get('/asistencia', authMiddleware, obtenerAsistencias);

/**
 * @openapi
 * /asistencia/{id}:
 *   get:
 *     summary: Obtiene un registro de asistencia por ID.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro de asistencia a obtener.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro de asistencia encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asistencia'
 *       404:
 *         description: Asistencia no encontrada.
 *       500:
 *         description: Error al obtener la asistencia.
 */
router.get('/asistencia/:id', authMiddleware, obtenerAsistenciaPorId);

/**
 * @openapi
 * /asistencia/alumno/{alumnoId}:
 *   get:
 *     summary: Obtiene la asistencia de un alumno.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: alumnoId
 *         required: true
 *         description: ID del alumno para obtener la asistencia.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de asistencias del alumno.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asistencia'
 *       500:
 *         description: Error al obtener la asistencia del alumno.
 */
router.get('/asistencia/alumno/:alumnoId', authMiddleware, obtenerAsistenciaPorAlumno);

/**
 * @openapi
 * /asistencia/clase/{claseId}:
 *   get:
 *     summary: Obtiene la asistencia de una clase.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: claseId
 *         required: true
 *         description: ID de la clase para obtener la asistencia.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de asistencias de la clase.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asistencia'
 *       500:
 *         description: Error al obtener la asistencia de la clase.
 */
router.get('/asistencia/clase/:claseId', authMiddleware, obtenerAsistenciaPorClase);

/**
 * @openapi
 * /asistencia/{id}:
 *   put:
 *     summary: Actualiza un registro de asistencia por ID.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro de asistencia a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alumnoId:
 *                 type: integer
 *                 description: ID del alumno.
 *               claseId:
 *                 type: integer
 *                 description: ID de la clase.
 *               fecha:
 *                 type: string
 *                 format: date
 *                 description: Fecha de la asistencia (YYYY-MM-DD).
 *               hora:
 *                 type: string
 *                 format: time
 *                 description: Hora de la asistencia (HH:MM:SS).
 *               estado:
 *                 type: string
 *                 enum: [PRESENTE, AUSENTE, TARDANZA, JUSTIFICADO]
 *                 description: Estado de la asistencia.
 *               observaciones:
 *                 type: string
 *                 description: Observaciones sobre la asistencia.
 *             required:
 *               - alumnoId
 *               - claseId
 *               - fecha
 *     responses:
 *       200:
 *         description: Asistencia actualizada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 data:
 *                   $ref: '#/components/schemas/Asistencia'
 *       400:
 *         description: Error de validación.
 *       500:
 *         description: Error al actualizar la asistencia.
 */
router.put('/asistencia/:id', authMiddleware, authorize('actualizar_asistencia'), actualizarAsistencia);

/**
 * @openapi
 * /asistencia/{id}:
 *   delete:
 *     summary: Elimina un registro de asistencia por ID.
 *     tags:
 *       - Asistencia
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del registro de asistencia a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asistencia eliminada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *       500:
 *         description: Error al eliminar la asistencia.
 */
router.delete('/asistencia/:id', authMiddleware, authorize('eliminar_asistencia'), eliminarAsistencia);

export default router;