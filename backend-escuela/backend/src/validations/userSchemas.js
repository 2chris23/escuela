import { z } from 'zod';

export const nombreSchema = z.string()
  .trim()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .max(255, 'El nombre no puede exceder 255 caracteres');

export const emailSchema = z.string()
  .trim()
  .email('Debe ser un correo electrónico válido')
  .max(255, 'El correo no puede exceder 255 caracteres');

export const passwordSchema = z.string()
  .trim()
  .min(6, 'La contraseña debe tener al menos 6 caracteres')
  .max(128, 'La contraseña no puede exceder 128 caracteres');

export const registerPasswordSchema = z.string()
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
  password: registerPasswordSchema,
});

// Esquema de login de usuario
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
