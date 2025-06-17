import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getProfesorDetalle } from '@/services/profesoresService'; // Importar función de servicio
import { Profesor } from '@/types'; // Importar tipo Profesor compartido
import { toast } from 'react-toastify'; // Importar toast para errores/notificaciones

// interface Profesor { // Eliminada la definición local
//   id: string;
//   nombre: string;
//   // Añadir más campos si es necesario (ej: email)
// }

const ProfesorPerfil = () => {
  const { id } = useParams<{ id: string }>();
  // En un escenario real, cargarías los datos del profesor aquí usando un servicio
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfesor = async () => {
      if (!id) { // Asegurarse de que hay un ID en la URL
        setError('ID de profesor no proporcionado.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(''); // Limpiar errores previos
        const data = await getProfesorDetalle(id);
        setProfesor(data);
      } catch (err: any) {
        console.error(`Error fetching profesor with id ${id}:`, err);
        const errorMessage = err.message || 'Error al cargar el perfil del profesor';
        setError(errorMessage);
        toast.error(`Error: ${errorMessage}`); // Mostrar error como toast
      } finally {
        setLoading(false);
      }
    };

    fetchProfesor();
  }, [id]); // Dependencia en el ID para recargar si cambia la URL

  // Eliminar datos simulados
  // const profesorSimulado: Profesor = { id: id || 'desconocido', nombre: 'Profesor de Ejemplo', email: 'profesor.ejemplo@escuela.com' };

  if (loading) {
    return <div className="text-center text-gray-600">Cargando perfil del profesor...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error al cargar el perfil: {error}</div>;
  }

  if (!profesor) {
    return <div className="text-center text-gray-600">Profesor no encontrado.</div>; // O mostrar un mensaje diferente
  }

  // Renderizar los datos del profesor real
  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Perfil del Profesor</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <p className="mt-1 text-gray-900">{profesor.id}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          {/* Acceder al nombre a través del objeto usuario anidado */}
          <p className="mt-1 text-gray-900">{profesor.usuario?.nombre || 'N/A'}</p>
        </div>
         {/* Mostrar correo electrónico si está disponible en el objeto usuario */}
         {profesor.usuario?.email && (
           <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <p className="mt-1 text-gray-900">{profesor.usuario.email}</p>
           </div>
        )}
        {/* Añadir botón de eliminar profesor si es necesario (considerar permisos) */}
        {/* <button onClick={() => {} } className="text-red-600 hover:text-red-800">Eliminar Profesor</button> */}
      </div>
    </div>
  );
};

export default ProfesorPerfil;
