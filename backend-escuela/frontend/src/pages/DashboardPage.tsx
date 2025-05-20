import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogout = () => {
    setToken(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Sistema Escolar</h1>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/profile')}
                className="mr-4"
              >
                Mi Perfil
              </Button>
              <Button variant="danger" onClick={handleLogout}>
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Gestión Académica
                </h3>
                <div className="mt-4 space-y-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/aulas')}
                  >
                    Aulas
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/actividades')}
                  >
                    Actividades
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/asistencias')}
                  >
                    Asistencias
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Usuarios
                </h3>
                <div className="mt-4 space-y-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/alumnos')}
                  >
                    Alumnos
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/profesores')}
                  >
                    Profesores
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/tutores')}
                  >
                    Tutores
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Reportes
                </h3>
                <div className="mt-4 space-y-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/reportes/asistencias')}
                  >
                    Reporte de Asistencias
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/reportes/actividades')}
                  >
                    Reporte de Actividades
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/reportes/rendimiento')}
                  >
                    Reporte de Rendimiento
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage; 