import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAulas, createAula } from '@/services/aulasService'; // Importar funciones de servicio
import { getProfesores } from '@/services/profesoresService'; // Importar servicio de profesores
import { Profesor, Aula } from '@/types'; // Importar tipos compartidos si no están ya
import { toast } from 'react-toastify';

// Definición de tipos para Aulas (puedes mover estos también a types/index.ts si quieres centralizarlos)
// interface Aula { // ELIMINAR ESTA DEFINICIÓN LOCAL
//   id: string;
//   nombre: string;
//   capacidad: number;
//   // Añadir más campos si es necesario
// }

// Asegúrate de que el tipo AulaDetalle no se usa aquí o impórtalo si es necesario para alguna lógica
// interface AulaDetalleData { ... } // ELIMINAR ESTA DEFINICIÓN LOCAL si no se usa o mover/importar

const AulasPage = () => {
  const navigate = useNavigate();
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]); // Estado para profesores
  const [showForm, setShowForm] = useState(false);
  const [nuevaAula, setNuevaAula] = useState({ nombre: '', capacidad: 0, profesorId: '' }); // Añadir profesorId al estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar aulas y profesores al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aulasData, profesoresData] = await Promise.all([
          getAulas(),
          getProfesores() // Cargar profesores
        ]);
        setAulas(aulasData);
        setProfesores(profesoresData); // Guardar profesores en estado
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validar que se haya seleccionado un profesor (profesorId no vacío)
    if (!nuevaAula.profesorId) {
        setError('Por favor, selecciona un profesor.');
        setLoading(false);
        return;
    }

    try {
      // Enviar los datos correctos al backend, convirtiendo capacidad y profesorId a número
      const aulaToCreate = {
        nombre: nuevaAula.nombre,
        capacidad: parseInt(nuevaAula.capacidad.toString()), // Convertir capacidad a número
        profesorId: parseInt(nuevaAula.profesorId), // Convertir profesorId a número
        // No necesitamos enviar descripcion si es opcional y no la tenemos en el form
      };

      await createAula(aulaToCreate);
      const aulasData = await getAulas();
      setAulas(aulasData); // Refrescar lista desde la API
      setShowForm(false);
      setNuevaAula({ nombre: '', capacidad: 0, profesorId: '' }); // Resetear estado incluyendo profesorId
    } catch (err: any) {
      console.error('Error calling createAula API:', err);
       // Intentar mostrar el mensaje de error detallado del backend si está disponible
      if (err.response && err.response.data && Array.isArray(err.response.data.error) && err.response.data.error.length > 0) {
        setError(`Error: ${err.response.data.error[0].message}`);
      } else {
        setError(err.message || 'Error al crear aula');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAula = async (aulaId: string, aulaNombre: string) => {
    if (!window.confirm(`¿Estás seguro de eliminar el aula ${aulaNombre}?`)) return;
    setLoading(true);
    setError('');
    try {
      const { deleteAula } = await import('@/services/aulasService');
      await deleteAula(aulaId);
      const aulasData = await getAulas();
      setAulas(aulasData); // Refrescar lista desde la API
      toast.success('Aula eliminada exitosamente.');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar aula');
      toast.error(`Error al eliminar aula: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Cargando aulas...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Aulas</h2>
        <button
          onClick={() => setShowForm(!showForm)} // Toggle form visibility
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Crear Nueva Aula'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Nueva Aula</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                value={nuevaAula.nombre}
                onChange={(e) => setNuevaAula({ ...nuevaAula, nombre: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacidad</label>
              <input
                type="number"
                value={nuevaAula.capacidad}
                onChange={(e) => setNuevaAula({ ...nuevaAula, capacidad: parseInt(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profesor</label>
              <select
                value={nuevaAula.profesorId}
                onChange={(e) => setNuevaAula({ ...nuevaAula, profesorId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un profesor</option>
                {profesores.map(profesor => (
                  // Asegúrate que el objeto profesor del backend tenga una propiedad 'id' (number) y 'nombre' (string)
                  <option key={profesor.id} value={profesor.id.toString()}>
                    {profesor.usuario?.nombre || profesor.nombre} {/* Usar nombre del usuario asociado si está disponible, sino nombre directo */}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Crear
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {aulas.length > 0 ? ( aulas.map(aula => (
          <div
            key={aula.id}
            className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/dashboard/aulas/${aula.id}`)}
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{aula.nombre}</h3>
            <p className="text-gray-600">Capacidad: {aula.capacidad} alumnos</p>
            <button
              onClick={e => { e.stopPropagation(); handleDeleteAula(aula.id, aula.nombre); }}
              className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
            >
              Eliminar
            </button>
          </div>
        )) ) : (
             <p className="text-center text-gray-600">No hay aulas disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default AulasPage;