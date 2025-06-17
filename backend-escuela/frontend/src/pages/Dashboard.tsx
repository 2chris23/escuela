import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from '@/layout/Sidebar';
import AulasPage from '@/features/aulas/AulasPage';
import ProfesoresPage from '@/features/profesores/ProfesoresPage';
import PerfilAdmin from '@/features/admin/PerfilAdmin';
import AulaDetalle from '@/features/aulas/AulaDetalle';
import AlumnoPerfil from '@/features/alumnos/AlumnoPerfil';
import AlumnosList from '@/features/alumnos/AlumnosList';
import ProfesorPerfil from '@/features/profesores/ProfesorPerfil';

const Dashboard = () => {
  const location = useLocation();
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/aulas/')) return 'Detalle de Aula';
    if (path.includes('/profesores/')) return 'Perfil del Profesor';
    if (path.includes('/alumnos/')) return 'Perfil del Alumno';
    if (path.includes('/aulas')) return 'Aulas';
    if (path.includes('/profesores')) return 'Profesores';
    if (path.includes('/perfil')) return 'Mi Perfil';
    return 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm p-4">
          <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="aulas" replace />} />
            <Route path="perfil" element={<PerfilAdmin />} />
            <Route path="aulas" element={<AulasPage />} />
            <Route path="aulas/:id" element={<AulaDetalle />} />
            <Route path="profesores" element={<ProfesoresPage />} />
            <Route path="profesores/:id" element={<ProfesorPerfil />} />
            <Route path="alumnos/:id" element={<AlumnoPerfil />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;