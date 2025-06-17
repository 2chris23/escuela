import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import LoginPage from '@/pages/Login';
import DashboardPage from '@/pages/Dashboard';
import AulasPage from '@/features/aulas/AulasPage';
import ProfesoresPage from '@/features/profesores/ProfesoresPage';
import AlumnoPerfil from '@/features/alumnos/AlumnoPerfil';
import ProfesorPerfil from './features/profesores/ProfesorPerfil';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Cargando sesión...</div>;
  }
  return token ? children : <Navigate to='/login' />;
};

const Spinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  const { loading } = useAuth();
  if (loading) return <Spinner />;
  return (
    <AuthProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Navigate to='/dashboard' replace />} />
          <Route
            path='/dashboard/*'
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />
          <Route path='/aulas' element={<AulasPage />} />
          <Route path='/profesores' element={<ProfesoresPage />} />
          <Route path='/alumno-perfil' element={<AlumnoPerfil />} />
          <Route path='/profesor-perfil' element={<ProfesorPerfil />} />
        </Routes>
      </Router>
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;