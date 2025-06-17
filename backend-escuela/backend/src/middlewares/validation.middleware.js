import { ZodError } from 'zod';

export default function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      res.status(400).json({ error: err.errors });
    }
  };
}