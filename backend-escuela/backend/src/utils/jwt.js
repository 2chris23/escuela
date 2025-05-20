import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token, callback) => {
  console.log('JWT_SECRET usado para verificar:', JWT_SECRET); // LOG
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error('Error en jwt.verify:', err); // LOG
    }
    callback(err, decoded);
  });
};

export { generateToken, verifyToken };