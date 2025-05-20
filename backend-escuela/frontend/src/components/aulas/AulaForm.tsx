import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useApi } from '../../services/useApi';

interface AulaFormProps {
  isEditing?: boolean;
}

interface Aula {
  nombre: string;
  capacidad: number;
  ubicacion: string;
  estado: string;
}

const AulaForm: React.FC<AulaFormProps> = ({ isEditing = false }) => {
  const [formData, setFormData] = useState<Aula>({
    nombre: '',
    capacidad: 0,
    ubicacion: '',
    estado: 'activa',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const { request } = useApi();

  useEffect(() => {
    const fetchAula = async () => {
      if (isEditing && id) {
        setLoading(true);
        const data = await request<Aula>('get', `/aulas/${id}`);
        if (data) {
          setFormData({
            nombre: data.nombre,
            capacidad: data.capacidad,
            ubicacion: data.ubicacion,
            estado: data.estado,
          });
        }
        setLoading(false);
      }
    };
    fetchAula();
    // eslint-disable-next-line
  }, [isEditing, id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEditing && id) {
        await request('put', `/aulas/${id}`, formData);
      } else {
        await request('post', '/aulas', formData);
      }
      navigate('/aulas');
    } catch (err) {
      setError('Error al guardar el aula');
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
      [name]: name === 'capacidad' ? parseInt(value) || 0 : value,
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Editar Aula' : 'Nueva Aula'}
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
          label="Capacidad"
          type="number"
          name="capacidad"
          value={formData.capacidad}
          onChange={handleChange}
          required
        />
        <Input
          label="Ubicación"
          type="text"
          name="ubicacion"
          value={formData.ubicacion}
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
            <option value="activa">Activa</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </div>
  );
};

export default AulaForm;