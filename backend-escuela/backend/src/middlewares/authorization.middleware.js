const authorize = (permisoNecesario) => {
  return (req, res, next) => {
    try {
      const usuarioId = req.user?.userId;
      const permisosDelUsuario = req.user?.permisos || [];
      const rolUsuario = req.user?.rol;

      console.log('authorize: usuarioId:', usuarioId);
      console.log('authorize: permisos del usuario desde token:', permisosDelUsuario);
      console.log('authorize: rol del usuario desde token:', rolUsuario);

      if (!usuarioId) {
        return res.status(401).json({ message: 'Usuario no autenticado.' });
      }

      if (!rolUsuario) {
        return res.status(403).json({ message: 'Usuario no autorizado. Rol no encontrado.' });
      }

      if (rolUsuario === 'Administrador') {
        return next();
      }

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
