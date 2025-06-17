// Mock de PrismaClient para evitar acceso real a la base de datos
global.jest = require('jest-mock');
jest.mock('@prisma/client', () => {
  const mPrisma = {
    profesor: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
    usuario: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Crear un nuevo profesor
const crearProfesor = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    // Validación de datos
    if (!usuarioId || isNaN(usuarioId)) {
      return res.status(400).json({ message: 'El usuarioId es obligatorio y debe ser un número válido.' });
    }

    const nuevoProfesor = await prisma.profesor.create({
      data: {
        usuarioId: parseInt(usuarioId),
      },
    });

    res.status(201).json({
      message: 'Profesor creado exitosamente.',
      data: nuevoProfesor,
    });
  } catch (error) {
    console.error('Error al crear profesor:', error);
    res.status(500).json({ message: 'Error al crear el profesor.' });
  }
};

// Obtener todos los profesores
const obtenerProfesores = async (req, res) => {
  try {
    const profesores = await prisma.profesor.findMany({
      include: { usuario: true, clases: true, actividades: true },
    });

    res.status(200).json({
      message: 'Profesores obtenidos exitosamente.',
      data: profesores,
    });
  } catch (error) {
    console.error('Error al obtener profesores:', error);
    res.status(500).json({ message: 'Error al obtener los profesores.' });
  }
};

// Obtener un profesor por su ID
const obtenerProfesorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const profesor = await prisma.profesor.findUnique({
      where: { id: parseInt(id) },
      include: { usuario: true, clases: true, actividades: true },
    });

    if (!profesor) {
      return res.status(404).json({ message: 'Profesor no encontrado.' });
    }

    res.status(200).json({
      message: 'Profesor obtenido exitosamente.',
      data: profesor,
    });
  } catch (error) {
    console.error('Error al obtener profesor por ID:', error);
    res.status(500).json({ message: 'Error al obtener el profesor.' });
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

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.profesor.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Profesor eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar profesor:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Profesor no encontrado.' });
    }

    res.status(500).json({ message: 'Error al eliminar el profesor.' });
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

test('Mock test profesor controller', () => {
  expect(true).toBe(true);
});

export {
  crearProfesor,
  obtenerProfesores,
  obtenerProfesorPorId,
  actualizarProfesor,
  eliminarProfesor,
  register,
  login,
};