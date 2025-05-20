import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Table from '../ui/Table';
import { useApi } from '../../services/useApi';

interface Aula {
  id: number;
  nombre: string;
  capacidad: number;
  ubicacion: string;
  estado: string;
}

const AulaList: React.FC = () => {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const { request, loading, error } = useApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAulas = async () => {
      const data = await request<Aula[]>('get', '/aulas');
      if (data) setAulas(data);
    };
    fetchAulas();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta aula?')) {
      const res = await request('delete', `/aulas/${id}`);
      if (res !== null) {
        setAulas(aulas.filter(aula => aula.id !== id));
      }
    }
  };

  const columns: { header: string; accessor: keyof Aula | ((a: Aula) => React.ReactNode) }[] = [
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Capacidad', accessor: 'capacidad' },
    { header: 'Ubicación', accessor: 'ubicacion' },
    {
      header: 'Estado',
      accessor: (aula: Aula) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          aula.estado === 'disponible' ? 'bg-green-100 text-green-800' :
          aula.estado === 'ocupada' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {aula.estado}
        </span>
      ),
    },
    {
      header: 'Acciones',
      accessor: (aula: Aula) => (
        <div className="space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/aulas/editar/${aula.id}`)}
          >
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(aula.id)}
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
        <h1 className="text-2xl font-bold">Lista de Aulas</h1>
        <Button variant="primary" onClick={() => navigate('/aulas/nueva')}>
          Nueva Aula
        </Button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <span className="text-gray-500">Cargando aulas...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <Table
        columns={columns}
        data={aulas}
        className="bg-white shadow-md rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default AulaList;