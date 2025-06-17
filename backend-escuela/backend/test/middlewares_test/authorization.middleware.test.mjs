import { PrismaClient } from '@prisma/client';
import validate from './validation.middleware.test.mjs';

const prisma = new PrismaClient();

const authorize = (permisoNecesario) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.user?.userId;

      if (!usuarioId) {
        return res.status(401).json({ message: 'Usuario no autenticado.' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: {
          rol: {
            include: {
              permisos: true,
            },
          },
        },
      });

      if (!usuario || !usuario.rol) {
        return res.status(403).json({ message: 'Usuario no autorizado. Rol no encontrado.' });
      }

      const permisosDelUsuario = usuario.rol.permisos.map((p) => p.nombre);

      if (!permisosDelUsuario.includes(permisoNecesario)) {
        return res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
      }

      next();
    } catch (error) {
      console.error('Error en el middleware de autorización:', error);
      return res.status(500).json({ message: 'Error al verificar la autorización.' });
    }
  };
};

export default authorize;