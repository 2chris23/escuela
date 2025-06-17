import { Router } from 'express';
import { z } from 'zod';
import validate from '../middlewares_test/validation.middleware.test.mjs';
import * as profesorController from '../controllers_test/profesor.controller.test.mjs';
import authMiddleware from '../middlewares_test/auth.middleware.test.mjs';
import authorize from '../middlewares_test/authorization.middleware.test.mjs';

const router = Router();

/**
 * Esquema para crear un profesor
 */
const createProfesorSchema = z.object({
  usuarioId: z
    .number()
    .int()
    .positive('El usuarioId debe ser un número positivo'),
});

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
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - usuarioId
 *     responses:
 *       201:
 *         description: Profesor creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error al crear el profesor
 */
router.post(
  '/',
  validate(createProfesorSchema),
  profesorController.crearProfesor
);

/**
 * @openapi
 * /api/profesores:
 *   get:
 *     summary: Obtener todos los profesores
 *     responses:
 *       200:
 *         description: Lista de profesores obtenida exitosamente
 *       500:
 *         description: Error al obtener los profesores
 */
router.get('/', profesorController.obtenerProfesores);

/**
 * @openapi
 * /api/profesores/{id}:
 *   get:
 *     summary: Obtener un profesor por su ID
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
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al obtener el profesor
 */
router.get('/:id', profesorController.obtenerProfesorPorId);

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
 *       404:
 *         description: Profesor no encontrado
 *       500:
 *         description: Error al eliminar el profesor
 */
router.delete('/:id', profesorController.eliminarProfesor);

export default router;