import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authorize = (permisoNecesario) => {
  return async (req, res, next) => {
    try {
      const usuarioId = req.user?.userId;
      console.log('authorize: usuarioId:', usuarioId);

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
      console.log('authorize: usuario encontrado:', usuario);

      if (!usuario || !usuario.rol) {
        return res.status(403).json({ message: 'Usuario no autorizado. Rol no encontrado.' });
      }

      req.user.rol = usuario.rol.nombre; // SIEMPRE agrega el nombre del rol a req.user
      if (usuario.rol.nombre === 'Administrador') {
        return next();
      }

      // Si no es admin, verificar permisos
      const permisosDelUsuario = usuario.rol.permisos.map((p) => p.nombre);
      console.log('authorize: permisos del usuario:', permisosDelUsuario);

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