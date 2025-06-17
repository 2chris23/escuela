import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo rol
const crearRol = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del rol es obligatorio.' });
    }

    const nuevoRol = await prisma.rol.create({
      data: { nombre },
    });

    res.status(201).json({
      message: 'Rol creado exitosamente.',
      data: nuevoRol,
    });
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ message: 'Error al crear el rol.' });
  }
};

// Obtener todos los roles
const obtenerRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany({
      include: { permisos: true },
    });

    res.status(200).json({
      message: 'Roles obtenidos exitosamente.',
      data: roles,
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener los roles.' });
  }
};

// Obtener un rol por su ID
const obtenerRolPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const rol = await prisma.rol.findUnique({
      where: { id: parseInt(id) },
      include: { permisos: true },
    });

    if (!rol) {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }

    res.status(200).json({
      message: 'Rol obtenido exitosamente.',
      data: rol,
    });
  } catch (error) {
    console.error('Error al obtener rol por ID:', error);
    res.status(500).json({ message: 'Error al obtener el rol.' });
  }
};

// Actualizar un rol por su ID
const actualizarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del rol es obligatorio.' });
    }

    const rolActualizado = await prisma.rol.update({
      where: { id: parseInt(id) },
      data: { nombre },
    });

    res.status(200).json({
      message: 'Rol actualizado exitosamente.',
      data: rolActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar rol:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }

    res.status(500).json({ message: 'Error al actualizar el rol.' });
  }
};

// Eliminar un rol por su ID
const eliminarRol = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.rol.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Rol eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }

    res.status(500).json({ message: 'Error al eliminar el rol.' });
  }
};

// Asignar permisos a un rol
const asignarPermisosARol = async (req, res) => {
  try {
    const { id } = req.params;
    const { permisos } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    if (!Array.isArray(permisos) || permisos.some(permisoId => isNaN(Number(permisoId)))) {
      return res.status(400).json({ message: 'La lista de permisos debe contener solo números válidos.' });
    }

    const rolActualizado = await prisma.rol.update({
      where: { id: parseInt(id) },
      data: {
        permisos: {
          set: permisos.map(permisoId => ({ id: parseInt(permisoId) })),
        },
      },
      include: { permisos: true },
    });

    res.status(200).json({
      message: 'Permisos asignados exitosamente al rol.',
      data: rolActualizado,
    });
  } catch (error) {
    console.error('Error al asignar permisos a rol:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Rol no encontrado.' });
    }

    res.status(500).json({ message: 'Error al asignar permisos al rol.' });
  }
};

export {
  crearRol,
  obtenerRoles,
  obtenerRolPorId,
  actualizarRol,
  eliminarRol,
  asignarPermisosARol,
};