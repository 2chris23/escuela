import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfesores, createProfesor, deleteProfesor } from '@/services/profesoresService'; // Importar funciones de servicio
import { Profesor } from '@/types'; // Importar tipo Profesor compartido
import { toast } from 'react-toastify'; // Importar toast

// type Profesor = { id: string; nombre: string }; // Eliminada la definición local

const ProfesoresPage = () => {
  const navigate = useNavigate();
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [nuevoProfesor, setNuevoProfesor] = useState({
    nombre: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({
    nombre: '',
    email: '',
    password: '',
  });

  // Cargar profesores al montar el componente usando el servicio
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setLoading(true);
        const data = await getProfesores();
        setProfesores(data);
        setError(''); // Limpiar error si la carga es exitosa
      } catch (err: any) {
        console.error('Error fetching profesores:', err);
        // Mostrar error al cargar profesores como un toast
        toast.error(`Error al cargar profesores: ${err.message || 'Error desconocido'}`);
        setError(err.message); // Mantener el estado de error para el banner (si decides mantenerlo para otros casos)
      } finally {
        setLoading(false);
      }
    };
    fetchProfesores();
  }, []);

  // Función de validación en el frontend
  const validateForm = () => {
    const errors: { nombre: string; email: string; password: string } = { nombre: '', email: '', password: '', };
    if (!nuevoProfesor.nombre) {
      errors.nombre = 'El nombre es obligatorio.';
    }
    if (!nuevoProfesor.email) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(nuevoProfesor.email)) {
      errors.email = 'Formato de correo electrónico inválido.';
    }
    if (!nuevoProfesor.password) {
      errors.password = 'La contraseña es obligatoria.';
    }
    setFormErrors(errors);
    return Object.values(errors).every(error => error === ''); // Retorna true si no hay errores
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Limpiar errores generales del backend
    setFormErrors({ nombre: '', email: '', password: '', }); // Limpiar errores del formulario

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await createProfesor(nuevoProfesor);
      await fetchProfesores(); // Refrescar lista desde la API
      setShowForm(false);
      setNuevoProfesor({ nombre: '', email: '', password: '', });
      toast.success('Profesor creado exitosamente!');
    } catch (err: any) {
      console.error('Error calling createProfesor API:', err);
      let errorMessage = 'Error al crear profesor';
      if (err.response && err.response.data) {
        if (Array.isArray(err.response.data.error) && err.response.data.error.length > 0) {
          errorMessage = err.response.data.error.map((e: any) => e.message).join(', ');
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfesores = async () => {
    try {
      setLoading(true);
      const data = await getProfesores();
      setProfesores(data);
      setError('');
    } catch (err: any) {
      console.error('Error fetching profesores:', err);
      toast.error(`Error al cargar profesores: ${err.message || 'Error desconocido'}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfesor = async (profesorId: string) => {
    setError('');
    setLoading(true);
    if (window.confirm(`¿Estás seguro de eliminar este profesor?`)) {
      try {
        await deleteProfesor(profesorId);
        // Volver a cargar la lista completa desde la API después de eliminar
        await fetchProfesores();
        toast.success('Profesor eliminado exitosamente.');
      } catch (err: any) {
        console.error(`Error calling deleteProfesor API for id ${profesorId}:`, err);
        const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar profesor';
        toast.error(`Error al eliminar profesor: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Cargando profesores...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Mantener el banner para errores de carga inicial si lo deseas, o eliminarlo y usar solo toasts */}
      {/* {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )} */}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Profesores</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Crear Nuevo Profesor'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Nuevo Profesor</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={nuevoProfesor.nombre}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, nombre: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.nombre ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.nombre && <p className="mt-1 text-sm text-red-600">{formErrors.nombre}</p>}
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                <input
                  type="email"
                  value={nuevoProfesor.email}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, email: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : ''}`}
                  required
                />
                 {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                  type="password"
                  value={nuevoProfesor.password}
                  onChange={(e) => setNuevoProfesor({ ...nuevoProfesor, password: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.password ? 'border-red-500' : ''}`}
                  required
                />
                 {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
             </div>
            <div className="flex justify-end">
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

      <div className="space-y-2">
        {profesores.length > 0 ? ( profesores.map(profesor => (
          <div
            key={profesor.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded"
          >
            <span>{profesor.usuario?.nombre}</span>
            <div className="space-x-2">
              <button
                onClick={() => navigate(`/dashboard/profesores/${profesor.id}`)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver perfil
              </button>
              <button
                  onClick={() => handleDeleteProfesor(profesor.id)}
                  className="text-red-600 hover:text-red-800 transition-colors"
              >
                  Eliminar
              </button>
            </div>
          </div>
        )) ) : (
            <p className="text-gray-600">No hay profesores disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default ProfesoresPage;