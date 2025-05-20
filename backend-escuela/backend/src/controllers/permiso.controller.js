import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un nuevo permiso
const crearPermiso = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validación de datos
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del permiso es obligatorio.' });
    }

    const nuevoPermiso = await prisma.permiso.create({
      data: { nombre },
    });

    res.status(201).json({
      message: 'Permiso creado exitosamente.',
      data: nuevoPermiso,
    });
  } catch (error) {
    console.error('Error al crear permiso:', error);
    res.status(500).json({ message: 'Error al crear el permiso.' });
  }
};

// Obtener todos los permisos
const obtenerPermisos = async (req, res) => {
  try {
    const permisos = await prisma.permiso.findMany();
    res.status(200).json({
      message: 'Permisos obtenidos exitosamente.',
      data: permisos,
    });
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ message: 'Error al obtener los permisos.' });
  }
};

// Obtener un permiso por su ID
const obtenerPermisoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    const permiso = await prisma.permiso.findUnique({
      where: { id: parseInt(id) },
      include: { roles: true }, // Incluir los roles que tienen este permiso
    });

    if (!permiso) {
      return res.status(404).json({ message: 'Permiso no encontrado.' });
    }

    res.status(200).json({
      message: 'Permiso obtenido exitosamente.',
      data: permiso,
    });
  } catch (error) {
    console.error('Error al obtener permiso por ID:', error);
    res.status(500).json({ message: 'Error al obtener el permiso.' });
  }
};

// Actualizar un permiso por su ID
const actualizarPermiso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    if (!nombre) {
      return res.status(400).json({ message: 'El nombre del permiso es obligatorio.' });
    }

    const permisoActualizado = await prisma.permiso.update({
      where: { id: parseInt(id) },
      data: { nombre },
    });

    res.status(200).json({
      message: 'Permiso actualizado exitosamente.',
      data: permisoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar permiso:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Permiso no encontrado.' });
    }

    res.status(500).json({ message: 'Error al actualizar el permiso.' });
  }
};

// Eliminar un permiso por su ID
const eliminarPermiso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ message: 'El ID debe ser un número válido.' });
    }

    await prisma.permiso.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Permiso eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar permiso:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Permiso no encontrado.' });
    }

    res.status(500).json({ message: 'Error al eliminar el permiso.' });
  }
};

export {
  crearPermiso,
  obtenerPermisos,
  obtenerPermisoPorId,
  actualizarPermiso,
  eliminarPermiso,
};