import React, { useEffect, useState } from 'react';
import { getAlumnos, createAlumno, deleteAlumno } from '@/services/alumnosService';
import { Alumno } from '@/types';

const AlumnosList: React.FC = () => {
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newAlumnoNombre, setNewAlumnoNombre] = useState<string>('');
  const [newAlumnoEmail, setNewAlumnoEmail] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  const fetchAlumnos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAlumnos();
      setAlumnos(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar alumnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleCreateAlumno = async () => {
    if (!newAlumnoNombre || !newAlumnoEmail) {
      setError('Nombre y correo son obligatorios');
      return;
    }
    setCreating(true);
    setError(null);
    try {
      await createAlumno({ nombre: newAlumnoNombre, email: newAlumnoEmail });
      setNewAlumnoNombre('');
      setNewAlumnoEmail('');
      await fetchAlumnos(); // Refrescar lista desde la API
    } catch (err: any) {
      setError(err.message || 'Error al crear alumno');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteAlumno = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este alumno?')) return;
    setError(null);
    try {
      await deleteAlumno(id);
      await fetchAlumnos(); // Refrescar lista desde la API
    } catch (err: any) {
      setError(err.message || 'Error al eliminar alumno');
    }
  };

  if (loading) return <div>Cargando alumnos...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lista de Alumnos</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newAlumnoNombre}
          onChange={(e) => setNewAlumnoNombre(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={newAlumnoEmail}
          onChange={(e) => setNewAlumnoEmail(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={handleCreateAlumno}
          disabled={creating}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {creating ? 'Creando...' : 'Crear Alumno'}
        </button>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Correo</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td className="py-2 px-4 border-b">{alumno.id}</td>
              <td className="py-2 px-4 border-b">{alumno.usuario?.nombre || alumno.nombre}</td>
              <td className="py-2 px-4 border-b">{alumno.usuario?.email || alumno.email}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDeleteAlumno(alumno.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {alumnos.length === 0 && (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No hay alumnos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AlumnosList;
