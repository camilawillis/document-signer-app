import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { autenticarUsuario } from '@/lib/mock/auth';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function DIFLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const usuario = await autenticarUsuario(email, password);
      login(usuario);
      navigate('/');
    } catch (err) {
      setError("Acceso restringido a personal autorizado del DIF");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-blue-700">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl w-96 shadow-xl">
        <div className="flex justify-center mb-6">
          <img 
            src="/logos/DIF_logo.png" 
            alt="Logo DIF" 
            className="h-24"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Institucional
            </label>
            <input
              id="email"
              type="email"
              placeholder="usuario@dif.gob.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Verificando...
            </div>
          ) : (
            'Ingresar al Sistema'
          )}
        </Button>

        <div className="mt-4 text-center text-sm text-gray-600">
          Solo personal autorizado del DIF
        </div>
      </form>
    </div>
  );
}