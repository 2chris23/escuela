import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '@/services/authService'; // Importar la función de servicio
import { User } from '@/types'; // Importar el tipo User para usarlo en la extracción

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Añadir estado de carga
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // Activar estado de carga

    try {
      // Usar la nueva estructura de loginUser
      const { token, refreshToken, user } = await loginUser({ email, password });
      login(user, token, refreshToken, remember);
      navigate('/dashboard');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-gray-200'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <h1 className='text-3xl font-bold text-gray-800 mb-6 text-center'>Sistema Escolar</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-6 text-center'>Iniciar Sesión</h2>

        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4' role='alert'>
            <span className='block sm:inline'>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
              Correo electrónico
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='email'
              type='email'
              placeholder='usuario@ejemplo.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading} // Deshabilitar input durante carga
            />
          </div>
          <div>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Contraseña
            </label>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3'
              id='password'
              type='password'
              placeholder='********'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading} // Deshabilitar input durante carga
            />
          </div>
          <div className='flex items-center justify-between'>
            <label className='flex items-center text-gray-700 text-sm font-bold'>
              <input
                className='mr-2 leading-tight'
                type='checkbox'
                checked={remember}
                onChange={() => setRemember(!remember)}
                disabled={loading} // Deshabilitar input durante carga
              />
              Mantener sesión activa
            </label>
          </div>
          <button
            type='submit'
            className='bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading} // Deshabilitar botón durante carga
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;