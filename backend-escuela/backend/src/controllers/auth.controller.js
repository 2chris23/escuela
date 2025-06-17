import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

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
    const permisos = await prisma.permiso.findMany({
      where: { roles: { some: { id: newUser.rolId } } },
    });
    const permisosNombres = permisos.map(p => p.nombre);
    const token = generateToken({ userId: newUser.id, rol: newUser.rol?.nombre, permisos: permisosNombres });
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
      include: { 
        rol: {
          include: {
            permisos: true
          }
        }
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Obtener los permisos del rol del usuario
    const permisosNombres = user.rol.permisos.map(p => p.nombre);

    // Generar el token con la información del usuario, su rol y permisos
    const token = generateToken({ 
      userId: user.id, 
      rol: user.rol?.nombre, 
      permisos: permisosNombres 
    });

    // Generar refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');

    // Guardar refresh token en la base de datos
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });

    // Devolver la información del usuario junto con el token y refresh token
    res.status(200).json({
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      role: user.rol?.nombre || 'usuario',
      permisos: permisosNombres,
      token,
      refreshToken,
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
      include: { rol: true },
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
      include: { rol: true },
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

const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token es requerido.' });
    }

    // Buscar el refresh token en la base de datos
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: { include: { rol: true } } },
    });

    if (!storedToken) {
      return res.status(403).json({ message: 'Refresh token inválido.' });
    }

    const user = storedToken.user;
    const permisos = await prisma.permiso.findMany({
      where: { roles: { some: { id: user.rolId } } },
    });
    const permisosNombres = permisos.map(p => p.nombre);

    // Generar un nuevo token de acceso
    const newToken = generateToken({ userId: user.id, rol: user.rol?.nombre, permisos: permisosNombres });

    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error('Error al refrescar el token:', error);
    res.status(500).json({ message: 'Error al refrescar el token.' });
  }
};

export {
  register,
  login,
  getProfile,
  updateProfile,
  refreshAccessToken,
};
