import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AulaList from './components/aulas/AulaList';
import AulaForm from './components/aulas/AulaForm';
import AlumnoList from './components/alumnos/AlumnoList';
import AlumnoForm from './components/alumnos/AlumnoForm';
import AsistenciaList from './components/asistencias/AsistenciaList';
import AsistenciaForm from './components/asistencias/AsistenciaForm';
import ActividadList from './components/actividades/ActividadList';
import ActividadForm from './components/actividades/ActividadForm';
import './App.css';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegistrationForm setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardPage />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <ProfilePage />
        </ProtectedRoute>
      } />

      <Route path="/aulas" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AulaList />
        </ProtectedRoute>
      } />
      
      <Route path="/aulas/nueva" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AulaForm />
        </ProtectedRoute>
      } />
      
      <Route path="/aulas/editar/:id" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AulaForm isEditing />
        </ProtectedRoute>
      } />

      <Route path="/alumnos" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AlumnoList />
        </ProtectedRoute>
      } />
      
      <Route path="/alumnos/nuevo" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AlumnoForm />
        </ProtectedRoute>
      } />
      
      <Route path="/alumnos/editar/:id" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <AlumnoForm isEditing />
        </ProtectedRoute>
      } />

      <Route
        path="/asistencias"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AsistenciaList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asistencias/nueva"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AsistenciaForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/asistencias/editar/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AsistenciaForm isEditing />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actividades"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActividadList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actividades/nueva"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActividadForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/actividades/editar/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ActividadForm isEditing />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
