import { verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Authorization header:', authHeader); // LOG

    // Validar que el encabezado Authorization esté presente y tenga el formato correcto
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Acceso denegado. Encabezado de autorización no válido o ausente.' });
    }

    const token = authHeader.split(' ')[1]; // Extraer el token después de "Bearer"
    console.log('Token extraído:', token); // LOG

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó token.' });
    }

    // Verificar el token
    verifyToken(token, (err, user) => {
      if (err) {
        console.error('Error al verificar el token:', err); // LOG
        return res.status(403).json({ message: 'Token inválido o expirado.' });
      }
      console.log('Payload decodificado:', user); // LOG
      // Asegura que siempre haya userId en req.user
      req.user = { ...user, userId: user.userId || user.id };
      next(); // Continuar con la siguiente función middleware o controlador
    });
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export default authMiddleware;