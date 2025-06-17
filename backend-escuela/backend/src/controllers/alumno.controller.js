import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo alumno
const crearAlumno = async (req, res) => {
  try {
    const { usuarioId, claseId } = req.body;

    // Validación de datos
    if (!usuarioId) {
      return res.status(400).json({ message: 'El usuarioId es obligatorio.' });
    }

    // Buscar el rol "Alumno"
    const rolAlumno = await prisma.rol.findUnique({ where: { nombre: 'Alumno' } });
    if (!rolAlumno) {
      return res.status(500).json({ message: 'No existe el rol Alumno en la base de datos.' });
    }

    // Asignar el rol al usuario
    await prisma.usuario.update({
      where: { id: parseInt(usuarioId) },
      data: { rolId: rolAlumno.id },
    });

    const nuevoAlumno = await prisma.alumno.create({
      data: {
        usuarioId: parseInt(usuarioId),
        claseId: claseId ? parseInt(claseId) : null,
      },
    });

    res.status(201).json({
      message: 'Alumno creado exitosamente.',
      data: nuevoAlumno,
    });
  } catch (error) {
    console.error('Error al crear alumno:', error);
    res.status(500).json({ message: 'Error al crear el alumno.' });
  }
};

// Obtener todos los alumnos
const obtenerAlumnos = async (req, res) => {
  try {
    const alumnos = await prisma.alumno.findMany({
      include: { usuario: true, clase: true },
    });

    res.status(200).json({
      message: 'Alumnos obtenidos exitosamente.',
      data: alumnos,
    });
  } catch (error) {
    console.error('Error al obtener alumnos:', error);
    res.status(500).json({ message: 'Error al obtener los alumnos.' });
  }
};

// Obtener un alumno por su ID
const obtenerAlumnoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'El ID debe ser un número válido.' 
      });
    }

    const alumno = await prisma.alumno.findUnique({
      where: { id: parseInt(id) },
      include: { 
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            rol: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        },
        aula: {
          include: {
            profesor: {
              include: {
                usuario: {
                  select: {
                    id: true,
                    nombre: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        tutor: {
          include: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                email: true
              }
            }
          }
        },
        actividades: {
          include: {
            actividad: {
              select: {
                id: true,
                titulo: true,
                descripcion: true,
                fechaInicio: true,
                fechaFin: true,
              }
            }
          }
        }
      },
    });

    if (!alumno) {
      return res.status(404).json({ 
        success: false,
        message: 'Alumno no encontrado.' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Alumno obtenido exitosamente.',
      data: alumno
    });
  } catch (error) {
    console.error('Error al obtener alumno por ID:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener el alumno.',
      error: error.message 
    });
  }
};

// Actualizar un alumno por su ID
const actualizarAlumno = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, claseId, tutorId } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const alumnoActualizado = await prisma.alumno.update({
      where: { id: parseInt(id) },
      data: {
        usuarioId: usuarioId ? parseInt(usuarioId) : undefined,
        claseId: claseId ? parseInt(claseId) : undefined,
        tutorId: tutorId ? parseInt(tutorId) : undefined,
      },
    });

    res.status(200).json({
      message: 'Alumno actualizado exitosamente.',
      data: alumnoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar alumno:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Alumno no encontrado.' });
    }

    res.status(500).json({ message: 'Error al actualizar el alumno.' });
  }
};

// Eliminar un alumno por su ID
const eliminarAlumno = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.alumno.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Alumno eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar alumno:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Alumno no encontrado.' });
    }

    res.status(500).json({ message: 'Error al eliminar el alumno.' });
  }
};

export {
  crearAlumno,
  obtenerAlumnos,
  obtenerAlumnoPorId,
  actualizarAlumno,
  eliminarAlumno,
};