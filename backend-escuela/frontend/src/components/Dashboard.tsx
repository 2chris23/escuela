import { useNavigate, Link } from 'react-router-dom';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="header-buttons">
          <Link to="/profile" className="profile-button">
            Mi Perfil
          </Link>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="dashboard-content">
        <h2>Bienvenido a la Plataforma Escolar</h2>
        <div className="dashboard-menu">
          <div className="menu-section">
            <h3>Gestión Académica</h3>
            <Link to="/aulas" className="menu-item">
              Aulas
            </Link>
            <Link to="/actividades" className="menu-item">
              Actividades
            </Link>
            <Link to="/asistencias" className="menu-item">
              Asistencias
            </Link>
          </div>
          <div className="menu-section">
            <h3>Usuarios</h3>
            <Link to="/alumnos" className="menu-item">
              Alumnos
            </Link>
            <Link to="/profesores" className="menu-item">
              Profesores
            </Link>
            <Link to="/tutores" className="menu-item">
              Tutores
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 