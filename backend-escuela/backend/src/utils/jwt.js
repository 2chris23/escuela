import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
console.log('JWT_SECRET being used:', JWT_SECRET);

const generateToken = (user) => {
  console.log('Generating token for user:', user);
  return jwt.sign(
    {
      userId: user.userId,
      rol: user.rol,
      permisos: user.permisos || []
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyToken = (token, callback) => {
  console.log('Verifying token:', token);
  console.log('Using JWT_SECRET for verification:', JWT_SECRET);
  jwt.verify(token, JWT_SECRET, callback);
};

export { generateToken, verifyToken };