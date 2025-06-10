import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileSignature, ShieldAlert, QrCode, Info, 
  LogIn, ClipboardList, Trash2, User, Shield, FileText, Hash, CheckCircle2, History 
} from 'lucide-react';
import Button from '@/components/ui/button';

export default function Manual() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate(-1)} 
            variant="ghost" 
            className="text-white hover:bg-blue-800"
          >
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">Manual Completo de Firma Digital</h1>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          
          {/* SECCIÓN 1: ACCESO */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <LogIn className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">Acceso al Sistema</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <User size={20} />
                  Credenciales de Prueba
                </h3>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="font-mono text-sm">📧 admin@dif.gob.mx</p>
                    <p className="font-mono text-sm mt-1">🔑 admin123</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Rol: Administrador
                    </span>
                  </div>
                  
                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="font-mono text-sm">📧 firmante@dif.gob.mx</p>
                    <p className="font-mono text-sm mt-1">🔑 firmante123</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Rol: Firmante
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <ShieldAlert size={20} />
                  Advertencias de Seguridad
                </h3>
                <ul className="list-disc pl-6 space-y-3 text-sm">
                  <li>Las claves se almacenan en el navegador (localStorage)</li>
                  <li>No usar contraseñas reales</li>
                  <li>Los datos se pierden al limpiar el caché</li>
                  <li>Versión demostrativa - No usar en producción</li>
                </ul>
              </div>
            </div>
          </section>

          {/* SECCIÓN 2: FIRMA DE DOCUMENTOS */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <FileSignature className="text-green-600" size={28} />
              <h2 className="text-2xl font-semibold">Proceso de Firma</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Pantalla de Firma
                  </h3>
                  <img src="imagenes/firmar.png" alt="Interfaz de firma" className="mb-4 rounded-lg shadow" />
                  <div className="space-y-2 text-sm">
                    <p>➊ <strong>Estadísticas:</strong> Muestra documentos firmados y tipos más usados</p>
                    <p>➋ <strong>Selector de archivos:</strong> Formatos permitidos: PDF (hasta 10MB)</p>
                    <p>➌ <strong>Tipos de documento:</strong> 
                      <ul className="list-disc pl-6 mt-1">
                        <li>Acta de Matrimonio</li>
                        <li>Acta de Nacimiento</li>
                        <li>Identificación Oficial</li>
                        <li>Otros Documentos</li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Hash size={20} />
                  Detalles Técnicos
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="text-sm"><strong>Algoritmo de Firma:</strong></p>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Tipo</span>
                      <span className="text-xs">RSA-PSS</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Longitud</span>
                      <span className="text-xs">4096 bits</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Hash</span>
                      <span className="text-xs">SHA-512</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="text-sm"><strong>Proceso Automático:</strong></p>
                    <ol className="list-decimal pl-6 mt-1 space-y-2 text-xs">
                      <li>Generación de hash SHA-256 del PDF</li>
                      <li>Firma digital con clave privada</li>
                      <li>Guardado en historial local</li>
                      <li>Generación de código QR del hash</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: VERIFICACIÓN */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <CheckCircle2 className="text-purple-600" size={28} />
              <h2 className="text-2xl font-semibold">Verificación de Firmas en Historial</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <QrCode size={20} />
                  Pantalla de Verificación en Historial
                </h3>
                <img src="/imagenes/verificar.png" alt="Verificación exitosa" className="mb-4 rounded-lg shadow" />
                <div className="space-y-2 text-sm">
                  <p>✅ <strong>Estado:</strong> Válida/Inválida con indicador de color</p>
                  <p>📅 <strong>Fecha y Hora:</strong> Registro exacto de la firma</p>
                  <p>🔍 <strong>Detalles Criptográficos:</strong>
                    <ul className="list-disc pl-6 mt-1">
                      <li>Hash del documento en formato hexadecimal</li>
                      <li>Clave pública en formato PEM</li>
                      <li>Código QR con hash codificado</li>
                    </ul>
                  </p>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Validación Técnica
                </h3>
                <div className="space-y-4 text-sm">
                  <p><strong>Proceso de Verificación:</strong></p>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Comparación del hash almacenado</li>
                    <li>Validación con clave pública correspondiente</li>
                    <li>Verificación de integridad criptográfica</li>
                  </ol>
                  
                  <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                    <p className="flex items-center gap-2">
                      <Info size={16} />
                      <strong>Nota importante:</strong> La verificación no comprueba el documento actual, solo el hash original
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 4: HISTORIAL */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <History className="text-orange-600" size={28} />
              <h2 className="text-2xl font-semibold">Gestión de Historial</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <ClipboardList size={20} />
                  Pantalla de Historial
                </h3>
                <img src="imagenes/historial.png" alt="Historial de firmas" className="mb-4 rounded-lg shadow" />
                <div className="space-y-2 text-sm">
                  <p>🔍 <strong>Búsqueda:</strong> Filtra por nombre, fecha o firmante</p>
                  <p>📋 <strong>Columnas:</strong>
                    <ul className="list-disc pl-6 mt-1">
                      <li>Nombre del documento</li>
                      <li>Fecha de firma</li>
                      <li>Usuario firmante</li>
                      <li>Tamaño del archivo</li>
                    </ul>
                  </p>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Trash2 size={20} />
                  Gestión de Datos
                </h3>
                <div className="space-y-4 text-sm">
                  <p><strong>Acciones Disponibles:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Exportar historial completo como JSON</li>
                    <li>Eliminar registros individuales</li>
                    <li>Borrar todo el historial</li>
                  </ul>
                  
                  <div className="mt-4 bg-red-50 p-4 rounded-md">
                    <p className="flex items-center gap-2">
                      <ShieldAlert size={16} />
                      <strong>Advertencia:</strong> La eliminación es permanente e irreversible
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}