import rateLimit from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 300, // 300 peticiones por minuto
  message: {
    message: 'Demasiadas solicitudes, intente más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

export default rateLimitMiddleware;