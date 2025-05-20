import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useApi } from '../../services/useApi';

interface ActividadFormProps {
  actividad?: any;
  isEditing?: boolean;
}

interface Aula {
  id: number;
  nombre: string;
}

const ActividadForm: React.FC<ActividadFormProps> = ({ actividad, isEditing = false }) => {
  const [formData, setFormData] = useState({
    titulo: actividad?.titulo || '',
    descripcion: actividad?.descripcion || '',
    fechaInicio: actividad?.fechaInicio ? new Date(actividad.fechaInicio).toISOString().split('T')[0] : '',
    fechaFin: actividad?.fechaFin ? new Date(actividad.fechaFin).toISOString().split('T')[0] : '',
    estado: actividad?.estado || 'pendiente',
    aulaId: actividad?.aulaId || '',
  });
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { request } = useApi();
  //const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchAulas = async () => {
      setLoading(true);
      const data = await request<Aula[]>('get', '/aulas');
      if (data) setAulas(data);
      setLoading(false);
    };
    fetchAulas();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        ...formData,
        aulaId: Number(formData.aulaId),
      };
      if (isEditing && actividad) {
        await request('put', `/actividades/${actividad.id}`, data);
      } else {
        await request('post', '/actividades', data);
      }
      navigate('/actividades');
    } catch (err) {
      setError('Error al guardar la actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
        {isEditing ? 'Editar Actividad' : 'Nueva Actividad'}
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
          label="Título"
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>
        <Input
          label="Fecha Inicio"
          type="date"
          name="fechaInicio"
          value={formData.fechaInicio}
          onChange={handleChange}
          required
        />
        <Input
          label="Fecha Fin"
          type="date"
          name="fechaFin"
          value={formData.fechaFin}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Estado</label>
          <select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="pendiente">Pendiente</option>
            <option value="activa">Activa</option>
            <option value="finalizada">Finalizada</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Aula</label>
          <select
            name="aulaId"
            value={formData.aulaId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Selecciona un aula</option>
            {aulas.map((aula) => (
              <option key={aula.id} value={aula.id}>{aula.nombre}</option>
            ))}
          </select>
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </div>
  );
};

export default ActividadForm;