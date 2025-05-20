import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token, callback) => {
  jwt.verify(token, JWT_SECRET, callback);
};

export { generateToken, verifyToken };

test('ejemplo de test para JWT', () => {
  expect(true).toBe(true);
});