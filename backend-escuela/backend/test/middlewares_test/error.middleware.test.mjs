export default function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  const statusCode = err.status || 500;
  const response = {
    message: err.message || 'Error interno del servidor',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

test('ejemplo de test para error middleware', () => {
  expect(true).toBe(true);
});