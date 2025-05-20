import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useApi } from '../../services/useApi';

interface Alumno {
  id: number;
  nombre: string;
  email: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  estado: string;
}

const AlumnoList: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const { request, loading, error } = useApi();
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchAlumnos = async () => {
      const data = await request<Alumno[]>('get', '/alumnos');
      if (data) setAlumnos(data);
    };
    fetchAlumnos();
    // eslint-disable-next-line
  }, [token]);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      const res = await request('delete', `/alumnos/${id}`);
      if (res !== null) {
        setAlumnos(alumnos.filter(alumno => alumno.id !== id));
      }
    }
  };

  const columns: { header: string; accessor: keyof Alumno | ((a: Alumno) => React.ReactNode) }[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Email', accessor: 'email' },
    { header: 'Fecha de Nacimiento', accessor: (alumno: Alumno) => new Date(alumno.fechaNacimiento).toLocaleDateString() },
    { header: 'Dirección', accessor: 'direccion' },
    { header: 'Teléfono', accessor: 'telefono' },
    {
      header: 'Estado',
      accessor: (alumno: Alumno) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          alumno.estado === 'activo' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {alumno.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (alumno: Alumno) => (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/alumnos/editar/${alumno.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(alumno.id)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lista de Alumnos</h1>
        <Button variant="primary" onClick={() => navigate('/alumnos/nuevo')}>
          Nuevo Alumno
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <span className="text-gray-500">Cargando alumnos...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Table
        columns={columns}
        data={alumnos}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default AlumnoList;