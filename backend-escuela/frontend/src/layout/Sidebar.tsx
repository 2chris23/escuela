import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const routes = [
    { path: '/dashboard/perfil', label: 'Mi Perfil', icon: '👤' },
    { path: '/dashboard/aulas', label: 'Aulas', icon: '🏫' },
    { path: '/dashboard/profesores', label: 'Profesores', icon: '👨‍🏫' },
  ];

  return (
    <div className="h-full w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Panel Admin</h2>
        <p className="text-sm text-gray-400">Bienvenido, {user?.role}</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        {routes.map(route => (
          <Link
            key={route.path}
            to={route.path}
            className={`flex items-center px-4 py-2 rounded hover:bg-gray-700 transition-colors ${
              location.pathname.includes(route.path) ? 'bg-gray-700' : ''
            }`}
          >
            <span className="mr-2">{route.icon}</span>
            {route.label}
          </Link>
        ))}
      </nav>

      <button
        onClick={logout}
        className="mt-auto px-4 py-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Sidebar;