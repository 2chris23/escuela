import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo tutor
const crearTutor = async (req, res) => {
  try {
    const { usuarioId } = req.body;
    if (!usuarioId) {
      return res.status(400).json({ message: 'El usuarioId es obligatorio.' });
    }
    // Buscar el rol "Tutor"
    const rolTutor = await prisma.rol.findUnique({ where: { nombre: 'Tutor' } });
    if (!rolTutor) {
      return res.status(500).json({ message: 'No existe el rol Tutor en la base de datos.' });
    }
    // Asignar el rol al usuario
    await prisma.usuario.update({
      where: { id: parseInt(usuarioId) },
      data: { rolId: rolTutor.id },
    });
    const nuevoTutor = await prisma.tutor.create({
      data: {
        usuarioId: parseInt(usuarioId),
      },
    });
    res.status(201).json({
      message: 'Tutor creado exitosamente.',
      data: nuevoTutor,
    });
  } catch (error) {
    console.error('Error al crear tutor:', error);
    res.status(500).json({ message: 'Error al crear el tutor.' });
  }
};

// Obtener todos los tutores
const obtenerTutores = async (req, res) => {
  try {
    const tutores = await prisma.tutor.findMany({
      include: { usuario: true, alumnos: true },
    });

    res.status(200).json({
      message: 'Tutores obtenidos exitosamente.',
      data: tutores,
    });
  } catch (error) {
    console.error('Error al obtener tutores:', error);
    res.status(500).json({ message: 'Error al obtener los tutores.' });
  }
};

// Obtener un tutor por su ID
const obtenerTutorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const tutor = await prisma.tutor.findUnique({
      where: { id: parseInt(id) },
      include: { usuario: true, alumnos: true },
    });

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor no encontrado.' });
    }

    res.status(200).json({
      message: 'Tutor obtenido exitosamente.',
      data: tutor,
    });
  } catch (error) {
    console.error('Error al obtener tutor por ID:', error);
    res.status(500).json({ message: 'Error al obtener el tutor.' });
  }
};

// Actualizar un tutor por su ID
const actualizarTutor = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const tutorActualizado = await prisma.tutor.update({
      where: { id: parseInt(id) },
      data: {
        usuarioId: usuarioId ? parseInt(usuarioId) : undefined,
      },
    });

    res.status(200).json({
      message: 'Tutor actualizado exitosamente.',
      data: tutorActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar tutor:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Tutor no encontrado.' });
    }

    res.status(500).json({ message: 'Error al actualizar el tutor.' });
  }
};

// Eliminar un tutor por su ID
const eliminarTutor = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.tutor.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Tutor eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar tutor:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Tutor no encontrado.' });
    }

    res.status(500).json({ message: 'Error al eliminar el tutor.' });
  }
};

export {
  crearTutor,
  obtenerTutores,
  obtenerTutorPorId,
  actualizarTutor,
  eliminarTutor,
};