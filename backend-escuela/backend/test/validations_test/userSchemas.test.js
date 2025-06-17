import { z } from 'zod';

// Esquema común para nombre
export const nombreSchema = z.string()
  .trim()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(255, 'El nombre no puede exceder 255 caracteres');

// Esquema común para email
export const emailSchema = z.string()
  .trim()
  .email('Debe ser un correo electrónico válido')
  .max(255, 'El correo no puede exceder 255 caracteres');

// Esquema común para password
export const passwordSchema = z.string()
  .trim()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(128, 'La contraseña no puede exceder 128 caracteres')
  .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
    message: 'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial',
  });

// Esquema de registro de usuario
export const registerSchema = z.object({
  nombre: nombreSchema,
  email: emailSchema,
  password: passwordSchema,
});

// Esquema de login de usuario
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
