import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Crear un nuevo profesor
const crearProfesor = async (req, res) => {
  // No es necesaria la validación manual aquí, ya se hace en la ruta con Zod
  const { nombre, email, password } = req.body;

  try {
    // Usar una transacción para asegurar que ambas operaciones (crear usuario y profesor) se completen o ninguna
    const result = await prisma.$transaction(async (prisma) => {
      // Buscar si el usuario ya existe (aunque la validación de email único en el esquema Zod ya lo maneja, es una buena práctica)
      const existingUser = await prisma.usuario.findUnique({ where: { email } });
      if (existingUser) {
        // Lanzar un error que será capturado por el catch exterior
        throw new Error('El correo electrónico ya está registrado.', { cause: { code: 'P2002' } }); // Usar cause para simular error de Prisma
      }

      // Buscar el rol "Profesor"
      const rolProfesor = await prisma.rol.findUnique({ where: { nombre: 'Profesor' } });
      if (!rolProfesor) {
        // Lanzar un error para indicar que el rol no existe
        throw new Error('No existe el rol Profesor en la base de datos.', { cause: { status: 500 } });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el nuevo usuario con el rol Profesor
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          email,
          password: hashedPassword,
          rolId: rolProfesor.id,
        },
      });

      // Crear la entrada de profesor asociada al nuevo usuario
      const nuevoProfesor = await prisma.profesor.create({
        data: {
          usuarioId: nuevoUsuario.id,
        },
        include: { usuario: true }, // Incluir datos del usuario en la respuesta
      });

      return nuevoProfesor; // Devolver el resultado de la transacción
    });

    // Si la transacción fue exitosa, enviar la respuesta
    res.status(201).json({
      message: 'Profesor creado exitosamente.',
      data: result,
    });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    // Manejo de errores específicos (ej: duplicado de email o rol no encontrado)
    if (error.cause && error.cause.code === 'P2002') { // Código de error simulado para unique constraint failed
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    } else if (error.cause && error.cause.status === 500) { // Código de error simulado para rol no encontrado
      return res.status(500).json({ message: error.message });
    }
    // Error genérico
    res.status(500).json({ message: 'Error al crear el profesor.' });
  }
};

// Obtener todos los profesores
const obtenerProfesores = async (req, res) => {
  try {
    console.log('Obteniendo profesores...');
    const profesores = await prisma.profesor.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: {
              select: {
                nombre: true
              }
            }
          }
        }
      }
    });

    console.log('Profesores encontrados:', profesores.length);
    res.status(200).json({
      message: 'Profesores obtenidos exitosamente.',
      data: profesores,
    });
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({
      message: 'Error al obtener los profesores.',
      error: error.message
    });
  }
};

// Obtener un profesor por su ID
const obtenerProfesorPorId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching professor with ID:', id);

    if (!id || isNaN(id)) {
      console.log('Invalid ID provided:', id);
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    // Cambiado a findUnique para asegurar búsqueda única
    const profesor = await prisma.profesor.findUnique({
      where: { id: parseInt(id) },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            rol: {
              select: {
                nombre: true
              }
            }
          }
        },
        aulas: true,
        actividades: {
          include: {
            aula: true,
            alumnos: {
              include: {
                alumno: {
                  include: {
                    usuario: {
                      select: {
                        nombre: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    });

    if (!profesor) {
      console.log('Professor not found with ID:', id);
      return res.status(404).json({ message: 'Profesor no encontrado.' });
    }

    console.log('Professor found:', profesor);
    res.status(200).json({
      message: 'Profesor obtenido exitosamente.',
      data: profesor,
    });
  } catch (error) {
    console.error('Error al obtener profesor por ID:', error);
    // Send more detailed error information
    res.status(500).json({
      message: 'Error al obtener el profesor.',
      error: error.message,
      code: error.code
    });
  }
};

// Actualizar un profesor por su ID
const actualizarProfesor = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const profesorActualizado = await prisma.profesor.update({
      where: { id: parseInt(id) },
      data: {
        usuarioId: usuarioId ? parseInt(usuarioId) : undefined,
      },
    });

    res.status(200).json({
      message: 'Profesor actualizado exitosamente.',
      data: profesorActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar profesor:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Profesor no encontrado.' });
    }

    res.status(500).json({ message: 'Error al actualizar el profesor.' });
  }
};

// Eliminar un profesor por su ID
const eliminarProfesor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    // Hard delete: eliminar el registro completamente
    const profesorEliminado = await prisma.profesor.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({
      message: 'Profesor eliminado exitosamente.',
      data: profesorEliminado
    });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Profesor no encontrado.' });
    }

    res.status(500).json({
      message: 'Error al eliminar el profesor.',
      error: error.message
    });
  }
};

// Registrar un nuevo usuario (para profesores)
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const nuevoUsuario = await prisma.usuario.create({
      data: { nombre, email, password: hashedPassword },
    });
    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      data: nuevoUsuario,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
    }
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, usuario.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      data: { id: usuario.id, nombre: usuario.nombre, email: usuario.email },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

export {
  crearProfesor,
  obtenerProfesores,
  obtenerProfesorPorId,
  actualizarProfesor,
  eliminarProfesor,
  register,
  login,
};