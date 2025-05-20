import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useApi } from '../../services/useApi';

interface Asistencia {
  id: number;
  alumnoId: number;
  alumnoNombre: string;
  fecha: string;
  estado: string;
  observaciones: string;
}

const AsistenciaList: React.FC = () => {
  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const { request, loading, error } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsistencias = async () => {
      const data = await request<Asistencia[]>('get', '/asistencias');
      if (data) setAsistencias(data);
    };
    fetchAsistencias();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta asistencia?')) {
      const res = await request('delete', `/asistencias/${id}`);
      if (res !== null) {
        setAsistencias(asistencias.filter(a => a.id !== id));
      }
    }
  };

  const columns: { header: string; accessor: keyof Asistencia | ((a: Asistencia) => React.ReactNode) }[] = [
    { header: 'Alumno', accessor: 'alumnoNombre' },
    {
      header: 'Fecha',
      accessor: (asistencia: Asistencia) => new Date(asistencia.fecha).toLocaleDateString(),
    },
    {
      header: 'Estado',
      accessor: (asistencia: Asistencia) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          asistencia.estado === 'presente' ? 'bg-green-100 text-green-800' :
          asistencia.estado === 'tardanza' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {asistencia.estado}
        </span>
      ),
    },
    { header: 'Observaciones', accessor: 'observaciones' },
    {
      header: 'Acciones',
      accessor: (asistencia: Asistencia) => (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/asistencias/editar/${asistencia.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(asistencia.id)}
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
        <h1 className="text-2xl font-bold">Lista de Asistencias</h1>
        <Button variant="primary" onClick={() => navigate('/asistencias/nueva')}>
          Nueva Asistencia
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <span className="text-gray-500">Cargando asistencias...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Table
        columns={columns}
        data={asistencias}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default AsistenciaList;