import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Crear una nueva aula
const crearAula = async (req, res) => {
  try {
    const { nombre, descripcion, profesorId } = req.body;

    // Validación de datos
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    const nuevaAula = await prisma.aula.create({
      data: {
        nombre,
        descripcion,
        profesorId: profesorId ? parseInt(profesorId) : null,
      },
      include: {
        profesor: {
          include: {
            usuario: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Aula creada exitosamente.',
      data: nuevaAula,
    });
  } catch (error) {
    console.error('Error al crear aula:', error);
    res.status(500).json({ message: 'Error al crear el aula.' });
  }
};

// Obtener todas las aulas
const obtenerAulas = async (req, res) => {
  try {
    console.log('Obteniendo aulas...');
    console.log('Usuario autenticado:', req.user);
    
    const aulas = await prisma.aula.findMany({
      include: {
        profesor: {
          include: {
            usuario: true
          }
        },
        alumnos: {
          include: {
            usuario: true,
            tutor: {
              include: {
                usuario: true
              }
            }
          }
        },
        actividades: true
      }
    });
    
    console.log('Aulas encontradas:', aulas);
    
    res.status(200).json({
      message: 'Aulas obtenidas exitosamente.',
      data: aulas,
    });
  } catch (error) {
    console.error('Error al obtener aulas:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error al obtener las aulas.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Obtener un aula por su ID
const obtenerAulaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const aula = await prisma.aula.findUnique({
      where: { id: parseInt(id) },
      include: { 
        profesor: { 
          include: { 
            usuario: true 
          } 
        },
        alumnos: { 
          include: { 
            usuario: true,
            tutor: {
              include: {
                usuario: true
              }
            }
          } 
        },
        actividades: {
          include: {
            alumnos: {
              include: {
                alumno: {
                  include: {
                    usuario: true
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!aula) {
      return res.status(404).json({ message: 'Aula no encontrada.' });
    }

    console.log('Data fetched for Aula details in backend:', aula);

    res.status(200).json({
      message: 'Aula obtenida exitosamente.',
      data: aula,
    });
  } catch (error) {
    console.error('Error al obtener aula por ID:', error);
    res.status(500).json({ message: 'Error al obtener el aula.' });
  }
};

// Actualizar un aula por su ID
const actualizarAula = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, profesorId } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const aulaActualizada = await prisma.aula.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        descripcion,
        profesorId: profesorId ? parseInt(profesorId) : undefined,
      },
      include: {
        profesor: {
          include: {
            usuario: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Aula actualizada exitosamente.',
      data: aulaActualizada,
    });
  } catch (error) {
    console.error('Error al actualizar aula:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Aula no encontrada.' });
    }

    res.status(500).json({ message: 'Error al actualizar el aula.' });
  }
};

// Eliminar un aula por su ID
const eliminarAula = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.aula.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Aula eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar aula:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Aula no encontrada.' });
    }

    res.status(500).json({ message: 'Error al eliminar el aula.' });
  }
};

// Agregar un alumno a un aula
const agregarAlumno = async (req, res) => {
  const { id } = req.params; // ID del aula
  const { nombre, email, password, tutorId } = req.body; // Datos del alumno (usuario)

  try {
    // Usar una transacción para asegurar atomicidad
    const result = await prisma.$transaction(async (prisma) => {
      // 1. Verificar que el aula exista
      const aula = await prisma.aula.findUnique({
        where: { id: parseInt(id) },
      });

      if (!aula) {
        throw new Error('Aula no encontrada.', { cause: { status: 404 } });
      }

      // 2. Buscar si el usuario con ese email ya existe
      const existingUser = await prisma.usuario.findUnique({ where: { email } });

      if (existingUser) {
        // Si el usuario existe, verificar si ya es alumno en esta aula
        const existingAlumnoInAula = await prisma.alumno.findFirst({
          where: { usuarioId: existingUser.id, aulaId: parseInt(id) },
          include: {
            usuario: true,
            tutor: { include: { usuario: true } }
          }
        });

        if(existingAlumnoInAula) {
          // Cambiado: devolver el alumno existente en la respuesta 409
          return res.status(409).json({
            message: 'El alumno ya está registrado en esta aula.',
            data: existingAlumnoInAula
          });
        } else {
          // Si el usuario existe pero no está en esta aula como alumno, crear la entrada en la tabla Alumno
          const nuevoAlumno = await prisma.alumno.create({
            data: {
              usuarioId: existingUser.id,
              aulaId: parseInt(id),
              tutorId: tutorId ? parseInt(tutorId) : null
            },
            include: { 
              usuario: true,
              tutor: {
                include: {
                  usuario: true
                }
              }
            },
          });
          return nuevoAlumno;
        }
      } else {
        // Si el usuario NO existe, proceder con la creación de un nuevo usuario y alumno
        // 3. Buscar el rol "Alumno"
        const rolAlumno = await prisma.rol.findUnique({ where: { nombre: 'Alumno' } });
        if (!rolAlumno) {
          throw new Error('No existe el rol Alumno en la base de datos.', { cause: { status: 500 } });
        }

        // 4. Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Crear el nuevo usuario con el rol Alumno
        const nuevoUsuario = await prisma.usuario.create({
          data: {
            nombre,
            email,
            password: hashedPassword,
            rolId: rolAlumno.id,
          },
        });

        // 6. Crear la entrada de alumno asociada al nuevo usuario y vincularla al aula
        const nuevoAlumno = await prisma.alumno.create({
          data: {
            usuarioId: nuevoUsuario.id,
            aulaId: parseInt(id),
            tutorId: tutorId ? parseInt(tutorId) : null
          },
          include: { 
            usuario: true,
            tutor: {
              include: {
                usuario: true
              }
            }
          },
        });

        return nuevoAlumno;
      }
    });

    res.status(201).json({
      message: 'Alumno agregado exitosamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error al agregar alumno al aula:', error);

    if (error.cause && error.cause.status) {
      return res.status(error.cause.status).json({ message: error.message });
    } else if (error.code === 'P2002') {
      return res.status(409).json({ message: 'Conflicto de datos (ej. email duplicado).', error: error.message });
    }

    res.status(500).json({ message: 'Error al agregar el alumno al aula.' });
  }
};

// Eliminar un alumno de un aula
const eliminarAlumnoDeAula = async (req, res) => {
  const { aulaId, alumnoId } = req.params;

  try {
    // Validar que los IDs sean números
    if (isNaN(aulaId) || isNaN(alumnoId)) {
      return res.status(400).json({ message: 'Los IDs del aula y del alumno deben ser números válidos.' });
    }

    // Buscar el alumno dentro del aula específica para asegurarnos de que existe esa relación
    const alumnoEncontrado = await prisma.alumno.findFirst({
      where: {
        id: parseInt(alumnoId),
        aulaId: parseInt(aulaId),
      }
    });

    if (!alumnoEncontrado) {
      return res.status(404).json({ message: 'Alumno no encontrado en esta aula.' });
    }

    // Eliminar la entrada de alumno (esto desvincula al usuario del aula)
    await prisma.alumno.delete({
      where: {
        id: alumnoEncontrado.id
      },
    });

    res.status(200).json({ message: 'Alumno eliminado exitosamente del aula.' });

  } catch (error) {
    console.error('Error al eliminar alumno del aula:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'El alumno o aula especificada no fue encontrada.' });
    }

    res.status(500).json({ message: 'Error al eliminar el alumno del aula.' });
  }
};

export {
  crearAula,
  obtenerAulas,
  obtenerAulaPorId,
  actualizarAula,
  eliminarAula,
  agregarAlumno,
  eliminarAlumnoDeAula,
};