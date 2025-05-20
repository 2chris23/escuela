import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useApi } from '../../services/useApi';

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  aulaId: number;
  aulaNombre: string;
}

const ActividadList: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const { request, loading, error } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividades = async () => {
      const data = await request<Actividad[]>('get', '/actividades');
      if (data) setActividades(data);
    };
    fetchActividades();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta actividad?')) {
      const res = await request('delete', `/actividades/${id}`);
      if (res !== null) {
        setActividades(actividades.filter(actividad => actividad.id !== id));
      }
    }
  };

  const columns: { header: string; accessor: keyof Actividad | ((a: Actividad) => React.ReactNode) }[] = [
    { header: 'Título', accessor: 'titulo' },
    { header: 'Descripción', accessor: 'descripcion' },
    {
      header: 'Fecha Inicio',
      accessor: (actividad: Actividad) => new Date(actividad.fechaInicio).toLocaleDateString(),
    },
    {
      header: 'Fecha Fin',
      accessor: (actividad: Actividad) => new Date(actividad.fechaFin).toLocaleDateString(),
    },
    {
      header: 'Estado',
      accessor: (actividad: Actividad) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          actividad.estado === 'activa' ? 'bg-green-100 text-green-800' :
          actividad.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {actividad.estado}
        </span>
      ),
    },
    { header: 'Aula', accessor: 'aulaNombre' },
    {
      header: 'Acciones',
      accessor: (actividad: Actividad) => (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/actividades/editar/${actividad.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(actividad.id)}
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
        <h1 className="text-2xl font-bold">Lista de Actividades</h1>
        <Button variant="primary" onClick={() => navigate('/actividades/nueva')}>
          Nueva Actividad
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <span className="text-gray-500">Cargando actividades...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Table
        columns={columns}
        data={actividades}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default ActividadList;