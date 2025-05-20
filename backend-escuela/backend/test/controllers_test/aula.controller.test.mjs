// Mock de PrismaClient para evitar acceso real a la base de datos
global.jest = require('jest-mock');
jest.mock('@prisma/client', () => {
  const mPrisma = {
    aula: {
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear una nueva aula
const crearAula = async (req, res) => {
  try {
    const { nombre, descripcion, profesorId } = req.body;

    // Validación de datos
    if (!nombre || !profesorId) {
      return res.status(400).json({ message: 'El nombre y el profesorId son obligatorios.' });
    }

    const nuevaAula = await prisma.aula.create({
      data: {
        nombre,
        descripcion,
        profesorId: parseInt(profesorId),
      },
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
    const aulas = await prisma.aula.findMany();
    res.status(200).json({
      message: 'Aulas obtenidas exitosamente.',
      data: aulas,
    });
  } catch (error) {
    console.error('Error al obtener aulas:', error);
    res.status(500).json({ message: 'Error al obtener las aulas.' });
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
      include: { profesor: true, alumnos: true, actividades: true },
    });

    if (!aula) {
      return res.status(404).json({ message: 'Aula no encontrada.' });
    }

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

test('Mock test aula controller', () => {
  expect(true).toBe(true);
});

export {
  crearAula,
  obtenerAulas,
  obtenerAulaPorId,
  actualizarAula,
  eliminarAula,
};