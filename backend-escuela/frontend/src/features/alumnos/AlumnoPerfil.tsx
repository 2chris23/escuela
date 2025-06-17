import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAlumnoDetalle } from '@/services/alumnosService'; // Importar función de servicio
import { Alumno } from '@/types'; // Importar tipo Alumno compartido

// interface Alumno { // Eliminada la definición local
//   id: string;
//   nombre: string;
//   // Añadir más campos si es necesario (ej: email)
// }

const AlumnoPerfil = () => {
  const { id } = useParams<{ id: string }>();
  const [alumno, setAlumno] = useState<Alumno | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar detalle del alumno al montar el componente usando el servicio
  useEffect(() => {
    const fetchAlumno = async () => {
      if (!id) return; // Asegurarse de tener un ID
      try {
        setLoading(true); // Iniciar carga
        const data = await getAlumnoDetalle(id); // Usar la función del servicio
        setAlumno(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Finalizar carga
      }
    };
    fetchAlumno();
  }, [id]); // Dependencia en `id` para recargar si cambia

  if (loading) {
    return <div className="text-center text-gray-600">Cargando perfil del alumno...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

   if (!alumno) {
      return <div className="text-center text-gray-600">No se encontró el alumno o error al cargar.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Perfil del Alumno</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <p className="mt-1 text-gray-900">{alumno.id}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <p className="mt-1 text-gray-900">{alumno.usuario?.nombre}</p>
        </div>
        {/* Mostrar otros campos del alumno si están disponibles */}
        {alumno.usuario?.email && (
           <div>
              <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <p className="mt-1 text-gray-900">{alumno.usuario.email}</p>
           </div>
        )}
        {/* Añadir botón de eliminar alumno si es necesario */}
        {/* <button onClick={() => {} } className="text-red-600 hover:text-red-800">Eliminar Alumno</button> */}
      </div>
    </div>
  );
};

export default AlumnoPerfil;
