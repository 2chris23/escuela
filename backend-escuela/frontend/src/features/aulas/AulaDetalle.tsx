import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAulaDetalle, addAlumnoToAula, deleteAula, deleteAlumnoFromAula } from '@/services/aulasService'; // Importar funciones de servicio
import { Alumno, Profesor } from '@/types'; // Importar tipos compartidos
import { toast } from 'react-toastify'; // Usar react-toastify

// Aunque AulaDetalleService devuelve AulaDetalle, definimos la interfaz aquí si es específica de este componente o mover a types/index.ts
interface AulaDetalleData {
    id: string;
    nombre: string;
    profesor: Profesor | null;
    alumnos: Alumno[];
    capacidad: number; // Añadir capacidad si es parte del detalle
}

const AulaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [aula, setAula] = useState<AulaDetalleData | null>(null);
  const [showAddAlumnoForm, setShowAddAlumnoForm] = useState(false);
  const [nuevoAlumno, setNuevoAlumno] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Función para cargar el detalle del aula
  const fetchAulaDetalleData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getAulaDetalle(id);
      console.log('Data fetched for Aula details:', data);
      if (data && data.alumnos) {
        console.log('Alumnos recibidos del backend:', data.alumnos);
      }
      setAula(data);
      setError(''); // Clear previous errors on successful fetch
    } catch (err: any) {
      setError(err.message);
      setAula(null); // Clear aula data on error
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  // Cargar detalle del aula al montar el componente y cuando cambie el ID
  useEffect(() => {
    fetchAulaDetalleData();
  }, [id]); // Dependencia en `id` para recargar si cambia

  const handleAddAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!id) return;
    try {
      const nuevoAlumnoData = await addAlumnoToAula(id, nuevoAlumno);
      // Si el alumno ya estaba, addAlumnoToAula lo devuelve igual (por el catch 409)
      setAula(prevAula => {
        if (!prevAula) return null;
        // Evitar duplicados
        if (prevAula.alumnos.some(a => a.id === nuevoAlumnoData.id)) return prevAula;
        return { ...prevAula, alumnos: [...prevAula.alumnos, nuevoAlumnoData] };
      });
      await fetchAulaDetalleData();
      toast.success('Alumno agregado o ya existente en el aula.');
      setShowAddAlumnoForm(false);
      setNuevoAlumno({ nombre: '', email: '', password: '', });
    } catch (err: any) {
      setError(err.message);
      toast.error(`Error al agregar alumno: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAula = async () => {
      setError('');
      setLoading(true);
      if (!aula || !id) return; // Asegurarse de tener datos y ID

      if (window.confirm(`¿Estás seguro de eliminar el aula ${aula.nombre}?`)) {
          try {
              await deleteAula(id); // Usar la función del servicio
              navigate('/dashboard/aulas'); // Redirigir a la lista después de eliminar
          } catch (err: any) {
              setError(err.message);
          } finally {
              setLoading(false);
          }
      }
  };

    const handleDeleteAlumno = async (alumnoId: string) => {
        setError('');
        setLoading(true);
        if (!aula || !id) return; // Asegurarse de tener datos y ID

        const alumnoAEliminar = aula.alumnos.find(a => a.id === alumnoId);
        if (!alumnoAEliminar) return;

        if (window.confirm(`¿Estás seguro de eliminar al alumno ${alumnoAEliminar.nombre} de esta aula?`)) {
            try {
                await deleteAlumnoFromAula(id, alumnoId); // Usar la función del servicio
                console.log('API Response - Delete Alumno: Success');
                // Actualizar el estado local eliminando el alumno
                // setAula(prevAula => {
                //     if (!prevAula) return null;
                //     const updatedAlumnos = prevAula.alumnos.filter(a => a.id !== alumnoId);
                //     return { ...prevAula, alumnos: updatedAlumnos };
                // });

                 // --- Start: Re-fetch aula details after successful delete ---
                await fetchAulaDetalleData(); // Recargar los datos del aula
                toast.success('Alumno eliminado exitosamente del aula.');
                // --- End: Re-fetch aula details after successful delete ---

            } catch (err: any) {
                setError(err.message);
                toast.error(`Error al eliminar alumno: ${err.message}`);
            } finally {
                setLoading(false);
            }
        }
    };


  if (loading) {
    return <div className="text-center text-gray-600">Cargando detalle del aula...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  if (!aula) {
      return <div className="text-center text-gray-600">No se encontró el aula o error al cargar.</div>;
  }

  console.log('Rendering Aula. Alumnos:', aula.alumnos);
  console.log('Alumno IDs:', aula.alumnos.map(a => a.id));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/dashboard/aulas')}
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Volver a Aulas
        </button>
        <button
          onClick={handleDeleteAula}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Eliminar Aula
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Profesor Asignado</h3>
        {aula.profesor ? (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <span>{aula.profesor.usuario?.nombre || 'N/A'}</span>
                <button
                    onClick={() => navigate(`/dashboard/profesores/${aula.profesor?.id}`)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                    Ver perfil
                </button>
            </div>
        ) : (
            <p className="text-gray-600">No hay profesor asignado.</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Alumnos</h3>
          <button
            onClick={() => setShowAddAlumnoForm(!showAddAlumnoForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            {showAddAlumnoForm ? 'Cancelar' : 'Agregar Alumno'}
          </button>
        </div>

        {showAddAlumnoForm && (
            <form onSubmit={handleAddAlumno} className="space-y-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      value={nuevoAlumno.nombre}
                      onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, nombre: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                    <input
                      type="email"
                      value={nuevoAlumno.email}
                      onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, email: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      value={nuevoAlumno.password}
                      onChange={(e) => setNuevoAlumno({ ...nuevoAlumno, password: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">
                        Agregar
                    </button>
                </div>
            </form>
        )}

        <div className="space-y-2">
          {aula.alumnos.length > 0 ? ( aula.alumnos.map(alumno => (
            <div
              key={alumno.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded"
            >
              <span>{alumno.usuario?.nombre || 'N/A'}</span>
              <div className="space-x-2">
                <button
                  onClick={() => navigate(`/dashboard/alumnos/${alumno.id}`)}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Ver perfil
                </button>
                <button
                  onClick={() => handleDeleteAlumno(alumno.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          )) ) : (
              <p className="text-gray-600">No hay alumnos en esta aula.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AulaDetalle;