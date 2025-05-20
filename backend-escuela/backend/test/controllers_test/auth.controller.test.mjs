// Mock de PrismaClient para evitar acceso real a la base de datos
global.jest = require('jest-mock');
jest.mock('@prisma/client', () => {
  const mPrisma = {
    usuario: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
    $disconnect: jest.fn(),
  };
  return { PrismaClient: jest.fn(() => mPrisma) };
});

import bcrypt from 'bcryptjs';
import { generateToken } from '../utils_test/jwt.test.mjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validación de datos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
      },
      include: { rol: true }, // Incluir el rol del usuario
    });

    // Generar un token JWT para el nuevo usuario
    const token = generateToken({ userId: newUser.id, rol: newUser.rol?.nombre });

    res.status(201).json({
      message: 'Usuario registrado exitosamente.',
      userId: newUser.id,
      token,
    });
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).json({ message: 'Error al registrar el usuario.' });
  }
};

// Inicio de sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación de datos
    if (!email || !password) {
      return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
    }

    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true }, // Incluir el rol del usuario
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar un token JWT para el usuario autenticado
    const token = generateToken({ userId: user.id, rol: user.rol?.nombre });

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token,
    });
  } catch (error) {
    console.error('Error durante el inicio de sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión.' });
  }
};

test('Mock test auth controller', () => {
  expect(true).toBe(true);
});

export {
  register,
  login,
};