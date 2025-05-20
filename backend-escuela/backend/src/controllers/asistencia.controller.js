import { PrismaClient } from '@prisma/client';
import { z } from 'zod'; // Importa Zod para la validación

const prisma = new PrismaClient();

// Esquema de Zod para la creación de asistencia
const createAsistenciaSchema = z.object({
  alumnoId: z.number().int().positive(),
  claseId: z.number().int().positive(),
  fecha: z.string().datetime(), // Asegúrate de que el formato sea ISO 8601
  hora: z.string().optional(),
  estado: z.enum(['PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO']),
  observaciones: z.string().optional(),
});

// Esquema de Zod para la actualización de asistencia (opcional)
const updateAsistenciaSchema = z.object({
  alumnoId: z.number().int().positive().optional(),
  claseId: z.number().int().positive().optional(),
  fecha: z.string().datetime().optional(),
  hora: z.string().optional(),
  estado: z.enum(['PRESENTE', 'AUSENTE', 'TARDANZA', 'JUSTIFICADO']).optional(),
  observaciones: z.string().optional().nullable(),
});

// Crear una nueva asistencia
export const crearAsistencia = async (req, res) => {
  try {
    const validatedData = createAsistenciaSchema.parse(req.body); // Valida los datos

    const nuevaAsistencia = await prisma.asistencia.create({
      data: {
        alumnoId: validatedData.alumnoId,
        claseId: validatedData.claseId,
        fecha: new Date(validatedData.fecha),
        hora: validatedData.hora ? new Date(`1970-01-01T${validatedData.hora}:00.000Z`) : null,
        estado: validatedData.estado,
        observaciones: validatedData.observaciones,
      },
    });

    res.status(201).json({
      message: 'Asistencia registrada exitosamente',
      data: nuevaAsistencia,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Error al registrar la asistencia' });
  }
};

// Obtener todas las asistencias
export const obtenerAsistencias = async (req, res) => {
  try {
    const asistencias = await prisma.asistencia.findMany();
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las asistencias' });
  }
};

// Obtener una asistencia por ID
export const obtenerAsistenciaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const asistencia = await prisma.asistencia.findUnique({
      where: { id },
    });
    if (!asistencia) {
      return res.status(404).json({ message: 'Asistencia no encontrada' });
    }
    res.json(asistencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la asistencia' });
  }
};

// Obtener la asistencia de un alumno
export const obtenerAsistenciaPorAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    const asistencias = await prisma.asistencia.findMany({
      where: { alumnoId: alumnoId },
    });
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la asistencia del alumno' });
  }
};

// Obtener la asistencia de una clase
export const obtenerAsistenciaPorClase = async (req, res) => {
  try {
    const { claseId } = req.params;
    const asistencias = await prisma.asistencia.findMany({
      where: { claseId: claseId },
    });
    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la asistencia de la clase' });
  }
};

// Actualizar una asistencia
export const actualizarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = updateAsistenciaSchema.parse(req.body);

    const asistenciaActualizada = await prisma.asistencia.update({
      where: { id },
      data: {
        alumnoId: validatedData.alumnoId,
        claseId: validatedData.claseId,
        fecha: validatedData.fecha ? new Date(validatedData.fecha) : undefined,
        hora: validatedData.hora ? new Date(`1970-01-01T${validatedData.hora}:00.000Z`) : undefined,
        estado: validatedData.estado,
        observaciones: validatedData.observaciones,
      },
    });
    res.json({ message: 'Asistencia actualizada', data: asistenciaActualizada });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Error de validación', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la asistencia' });
  }
};

// Eliminar una asistencia
export const eliminarAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.asistencia.delete({
      where: { id },
    });
    res.json({ message: 'Asistencia eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la asistencia' });
  }
};