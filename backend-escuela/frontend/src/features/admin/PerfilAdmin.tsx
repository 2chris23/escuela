import { useAuth } from '@/context/AuthContext';

const PerfilAdmin = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-semibold mb-6">Mi Perfil</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <p className="mt-1 text-gray-900">{user?.id}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Rol</label>
          <p className="mt-1 text-gray-900">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

export default PerfilAdmin; 