import React, { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useApi } from '../../services/useApi';

interface AsistenciaFormProps {
  asistencia?: any;
  isEditing?: boolean;
}

interface Alumno {
  id: number;
  nombre: string;
}

const AsistenciaForm: React.FC<AsistenciaFormProps> = ({ asistencia, isEditing = false }) => {
  const [formData, setFormData] = useState({
    alumnoId: asistencia?.alumnoId || '',
    fecha: asistencia?.fecha ? new Date(asistencia.fecha).toISOString().split('T')[0] : '',
    estado: asistencia?.estado || 'presente',
    observaciones: asistencia?.observaciones || '',
  });
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { request } = useApi();

  useEffect(() => {
    const fetchAlumnos = async () => {
      setLoading(true);
      const data = await request<Alumno[]>('get', '/alumnos');
      if (data) setAlumnos(data);
      setLoading(false);
    };
    fetchAlumnos();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = {
        ...formData,
        alumnoId: Number(formData.alumnoId),
      };
      if (isEditing && asistencia) {
        await request('put', `/asistencias/${asistencia.id}`, data);
      } else {
        await request('post', '/asistencias', data);
      }
      navigate('/asistencias');
    } catch (err) {
      setError('Error al guardar la asistencia');
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
        {isEditing ? 'Editar Asistencia' : 'Nueva Asistencia'}
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
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Alumno</label>
          <select
            name="alumnoId"
            value={formData.alumnoId}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="">Selecciona un alumno</option>
            {alumnos.map((alumno) => (
              <option key={alumno.id} value={alumno.id}>{alumno.nombre}</option>
            ))}
          </select>
        </div>
        <Input
          label="Fecha"
          type="date"
          name="fecha"
          value={formData.fecha}
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
            <option value="presente">Presente</option>
            <option value="ausente">Ausente</option>
            <option value="tardanza">Tardanza</option>
            <option value="justificado">Justificado</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>
        <Button type="submit" variant="primary" fullWidth disabled={loading}>
          {isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </form>
    </div>
  );
};

export default AsistenciaForm;