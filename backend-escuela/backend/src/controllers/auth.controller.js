import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registro de usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.usuario.create({
      data: { nombre, email, password: hashedPassword },
      include: { rol: true },
    });
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
    if (!email || !password) {
      return res.status(400).json({ message: 'El correo electrónico y la contraseña son obligatorios.' });
    }
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { rol: true },
    });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
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

// Obtener perfil del usuario
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
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
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error al obtener el perfil:', error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario.' });
  }
};

// Actualizar perfil del usuario
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre es obligatorio.' });
    }

    const updatedUser = await prisma.usuario.update({
      where: { id: userId },
      data: { nombre },
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
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    res.status(500).json({ message: 'Error al actualizar el perfil del usuario.' });
  }
};

export {
  register,
  login,
  getProfile,
  updateProfile,
};