import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useApi } from '../../services/useApi';

interface AlumnoFormProps {
  isEditing?: boolean;
}

interface Alumno {
  nombre: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  estado: string;
}

const AlumnoForm: React.FC<AlumnoFormProps> = ({ isEditing = false }) => {
  const [formData, setFormData] = useState<Alumno>({
    nombre: '',
    email: '',
    fechaNacimiento: '',
    direccion: '',
    telefono: '',
    estado: 'activo',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { request } = useApi();

  useEffect(() => {
    const fetchAlumno = async () => {
      if (isEditing && id) {
        setLoading(true);
        const data = await request<Alumno>('get', `/alumnos/${id}`);
        if (data) {
          setFormData({
            nombre: data.nombre,
            email: data.email,
            fechaNacimiento: new Date(data.fechaNacimiento).toISOString().split('T')[0],
            direccion: data.direccion,
            telefono: data.telefono,
            estado: data.estado,
          });
        }
        setLoading(false);
      }
    };
    fetchAlumno();
    // eslint-disable-next-line
  }, [isEditing, id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEditing && id) {
        await request('put', `/alumnos/${id}`, formData);
      } else {
        await request('post', '/alumnos', formData);
      }
      navigate('/alumnos');
    } catch (err) {
      setError('Error al guardar el alumno');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Alumno' : 'Nuevo Alumno'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {loading && (
        <div className="text-center my-4">
          <span className="text-gray-500">Cargando...</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg">
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
          label="Fecha de Nacimiento"
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          required
        />
        <Input
          label="Dirección"
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          required
        />
        <Input
          label="Teléfono"
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Estado
          </label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </div>
  );
};

export default AlumnoForm;