import { verifyToken } from '../utils/jwt.js';

const authMiddleware = (req, res, next) => {
  try {
    console.log('Headers recibidos:', req.headers);
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      console.log('No se encontró el header de autorización');
      return res.status(401).json({ message: 'No se proporcionó un token de autenticación.' });
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('El token no tiene el formato Bearer');
      return res.status(401).json({ message: 'Formato de token inválido. Debe ser: Bearer <token>' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token);

    verifyToken(token, (err, decoded) => {
      if (err) {
        console.error('Error al verificar el token:', err);
        return res.status(401).json({ message: 'Token inválido o expirado.' });
      }

      console.log('Token decodificado:', decoded);
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    res.status(500).json({ message: 'Error al procesar la autenticación.' });
  }
};

export default authMiddleware;