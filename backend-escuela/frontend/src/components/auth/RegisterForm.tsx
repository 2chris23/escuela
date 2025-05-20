import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useApi } from '../../services/useApi';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { request } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const res = await request<{ token: string }>('post', '/auth/register', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      if (res && res.token) {
        setToken(res.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registro</h2>
        {error && (
          <div className="error-message">{error}</div>
        )}
        {loading && (
          <div className="text-center my-4">
            <span className="text-gray-500">Registrando...</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <Input
            label="Nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirmar Contraseña"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            Registrarse
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;