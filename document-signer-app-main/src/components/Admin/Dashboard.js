import React from 'react';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { FileSignature, History, BookOpen, ScanQrCode  } from 'lucide-react';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <img src="/logos/DIF_jalisco_logo_blanco.png" alt="DIF Logo" className="h-12" />
          <h1 className="text-xl font-bold">Sistema de Firma Digital</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden md:inline">Bienvenido, {usuario?.nombre}</span>
          <Button onClick={logout} variant="ghost" className="text-white hover:bg-blue-800">
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Panel de Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Botones superiores */}
            <Button 
              onClick={() => navigate('/firmar')} 
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-colors"
            >
              <FileSignature size={36} className="text-blue-600" />
              <span className="text-lg font-medium">Firmar Documento</span>
              <span className="text-sm text-gray-500">Agrega documentos nuevos</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/historial')} 
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-colors"
            >
              <History size={36} className="text-blue-600" />
              <span className="text-lg font-medium">Historial</span>
              <span className="text-sm text-gray-500">Busca documentos firmados</span>
            </Button>

            {/* Botón manual centrado debajo */}
            <div className="col-span-2 flex justify-center mt-4">
              <Button 
                onClick={() => navigate('/manual')} 
                className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-colors"
              >
                <BookOpen size={36} className="text-blue-600" />
                <span className="text-lg font-medium">Manual de Usuario</span>
                <span className="text-sm text-gray-500">Guía completa de uso</span>
              </Button>

              <Button 
              onClick={() => navigate('/qr')} 
              className="h-32 flex flex-col items-center justify-center gap-3 hover:bg-blue-50 transition-colors"
            >
              <ScanQrCode size={36} className="text-blue-600" />
              <span className="text-lg font-medium">Lector de QR</span>
              <span className="text-sm text-gray-500">Comprueba la veracidad de documentos</span>
            </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}