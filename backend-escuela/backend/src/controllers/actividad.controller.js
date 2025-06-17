import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear una nueva actividad
const crearActividad = async (req, res) => {
  try {
    const { titulo, descripcion, fechaEntrega, profesorId, aulaId } = req.body;

    // Validación de datos
    if (!titulo || !profesorId) {
      return res.status(400).json({ message: 'El título y el profesorId son obligatorios.' });
    }

    const nuevaActividad = await prisma.actividad.create({
      data: {
        titulo,
        descripcion,
        fechaEntrega: fechaEntrega ? new Date(fechaEntrega) : null,
        profesorId: parseInt(profesorId),
        aulaId: aulaId ? parseInt(aulaId) : null,
      },
    });

    res.status(201).json({
      message: 'Actividad creada exitosamente.',
      data: nuevaActividad,
    });
  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({ message: 'Error al crear la actividad.' });
  }
};

// Obtener todas las actividades
const obtenerActividades = async (req, res) => {
  try {
    const actividades = await prisma.actividad.findMany();
    res.status(200).json({
      message: 'Actividades obtenidas exitosamente.',
      data: actividades,
    });
  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({ message: 'Error al obtener las actividades.' });
  }
};

// Obtener una actividad por su ID
const obtenerActividadPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const actividad = await prisma.actividad.findUnique({
      where: { id: parseInt(id) },
    });

    if (!actividad) {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    res.status(200).json({
      message: 'Actividad obtenida exitosamente.',
      data: actividad,
    });
  } catch (error) {
    console.error('Error al obtener actividad por ID:', error);
    res.status(500).json({ message: 'Error al obtener la actividad.' });
  }
};

// Actualizar una actividad por su ID
const actualizarActividad = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, fechaEntrega, profesorId, aulaId } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const actividadActualizada = await prisma.actividad.update({
      where: { id: parseInt(id) },
      data: {
        titulo,
        descripcion,
        fechaEntrega: fechaEntrega ? new Date(fechaEntrega) : null,
        profesorId: profesorId ? parseInt(profesorId) : undefined,
        aulaId: aulaId ? parseInt(aulaId) : undefined,
      },
    });

    res.status(200).json({
      message: 'Actividad actualizada exitosamente.',
      data: actividadActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar actividad:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    res.status(500).json({ message: 'Error al actualizar la actividad.' });
  }
};

// Eliminar una actividad por su ID
const eliminarActividad = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.actividad.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Actividad eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar actividad:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Actividad no encontrada.' });
    }

    res.status(500).json({ message: 'Error al eliminar la actividad.' });
  }
};

export {
  crearActividad,
  obtenerActividades,
  obtenerActividadPorId,
  actualizarActividad,
  eliminarActividad,
};