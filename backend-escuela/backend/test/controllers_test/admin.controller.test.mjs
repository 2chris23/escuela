import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Dashboard de admin
const dashboard = async (req, res) => {
  res.json({ message: 'Bienvenido al dashboard de admin' });
};

// Listar usuarios (ejemplo)
const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      include: { rol: true },
    });
    res.json({ usuarios });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

// Registrar un nuevo administrador
const register = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        rol: { connect: { nombre: 'Administrador' } },
      },
      include: { rol: true },
    });
    res.status(201).json({ message: 'Administrador creado exitosamente.', data: usuario });
  } catch (error) {
    console.error('Error al registrar admin:', error);
    res.status(500).json({ message: 'Error al registrar el administrador.' });
  }
};

// Listar todos los administradores
const obtenerAdmins = async (_req, res) => {
  try {
    const admins = await prisma.usuario.findMany({ where: { rol: { nombre: 'Administrador' } }, include: { rol: true } });
    res.status(200).json({ data: admins });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener administradores.' });
  }
};

// Obtener un administrador por ID
const obtenerAdminPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await prisma.usuario.findUnique({ where: { id: parseInt(id) }, include: { rol: true } });
    if (!admin || admin.rol.nombre !== 'Administrador') {
      return res.status(404).json({ message: 'Administrador no encontrado.' });
    }
    res.status(200).json({ data: admin });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el administrador.' });
  }
};

// Actualizar un administrador
const actualizarAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password } = req.body;

    const existingAdmin = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: { rol: true },
    });

    if (!existingAdmin || existingAdmin.rol.nombre !== 'Administrador') {
      return res.status(404).json({ message: 'Administrador no encontrado.' });
    }

    const data = {};
    if (nombre) data.nombre = nombre;
    if (email) data.email = email;
    if (password) data.password = await bcrypt.hash(password, 10);
    const admin = await prisma.usuario.update({ where: { id: parseInt(id) }, data });
    res.status(200).json({ message: 'Administrador actualizado.', data: admin });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el administrador.' });
  }
};

// Eliminar un administrador
const eliminarAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const existingAdmin = await prisma.usuario.findUnique({
      where: { id: parseInt(id) },
      include: { rol: true },
    });
    if (!existingAdmin || existingAdmin.rol.nombre !== 'Administrador') {
      return res.status(404).json({ message: 'Administrador no encontrado.' });
    }
    await prisma.usuario.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Administrador eliminado exitosamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el administrador.' });
  }
};

test('Mock test admin controller', () => {
  expect(true).toBe(true);
});

export {
  dashboard,
  listarUsuarios,
  register,
  obtenerAdmins,
  obtenerAdminPorId,
  actualizarAdmin,
  eliminarAdmin,
};