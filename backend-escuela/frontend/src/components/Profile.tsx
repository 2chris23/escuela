import { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfileProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface UserProfile {
  id: number;
  nombre: string;
  email: string;
  rol?: {
    nombre: string;
  };
}

const Profile = ({ setIsAuthenticated }: ProfileProps) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setNombre(response.data.nombre);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
      setError('Error al cargar el perfil');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:3000/api/auth/profile',
        { nombre },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
      setIsEditing(false);
      setSuccess('Perfil actualizado exitosamente');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError('Error al actualizar el perfil');
    }
  };

  if (!profile) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Perfil de Usuario</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {!isEditing ? (
          <div className="profile-info">
            <p><strong>Nombre:</strong> {profile.nombre}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Rol:</strong> {profile.rol?.nombre || 'No asignado'}</p>
            <button 
              onClick={() => setIsEditing(true)}
              className="edit-button"
            >
              Editar Perfil
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="button-group">
              <button type="submit" className="save-button">
                Guardar Cambios
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile; 