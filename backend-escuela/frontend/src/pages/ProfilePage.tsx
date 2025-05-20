import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

interface Profile {
  nombre: string;
  email: string;
  rol: string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
        setFormData({ nombre: response.data.nombre });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Error al cargar el perfil');
      }
    };

    fetchProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:3000/api/auth/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(prev => prev ? { ...prev, nombre: formData.nombre } : null);
      setIsEditing(false);
      setSuccess('Perfil actualizado correctamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center">
            <p className="text-gray-500">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
            {!isEditing && (
              <Button
                variant="secondary"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{success}</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <Input
                label="Nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Guardar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{profile.nombre}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rol</label>
                <p className="mt-1 text-sm text-gray-900">{profile.rol}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => navigate('/dashboard')}
            >
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 