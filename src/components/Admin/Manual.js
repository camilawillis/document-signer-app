import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileSignature, ShieldAlert, QrCode, Info, 
  LogIn, ClipboardList, Trash2, User, Shield, FileText, Hash, CheckCircle2, History, Camera, UploadCloud // UploadCloud se usará ahora
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
              <h2 className="text-2xl font-semibold">Proceso de Firma y Sellado de Documentos con QR</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Pantalla de Firma
                  </h3>
                  {/* Se recomienda una imagen actualizada que muestre el QR draggable */}
                  <img src="imagenes/firmar.png" alt="Interfaz de firma" className="mb-4 rounded-lg shadow" />
                  <div className="space-y-2 text-sm">
                    <p>➊ <strong>Estadísticas:</strong> Muestra documentos firmados y tipos más usados</p>
                    <p>➋ <strong>Selector de archivos:</strong> Formatos permitidos: PDF (hasta 10MB)</p>
                    <p>➌ <strong>Posicionamiento del QR:</strong> Tras cargar el PDF, podrás arrastrar una imagen de código QR sobre la previsualización del documento para definir su posición final antes de firmar.</p>
                    <p>➍ <strong>Tipos de documento:</strong> 
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
                  Detalles Técnicos y Proceso de Incrustación
                </h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="text-sm"><strong>Algoritmo de Firma:</strong></p>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Tipo</span>
                      <span className="text-xs">RSA-PSS</span>
                      <span className="text-xs">Longitud</span>
                      <span className="text-xs">4096 bits</span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">Hash</span>
                      <span className="text-xs">SHA-512</span>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-md shadow">
                    <p className="text-sm"><strong>Proceso Automático al Firmar:</strong></p>
                    <ol className="list-decimal pl-6 mt-1 space-y-2 text-xs">
                      <li>Generación de hash SHA-256 del PDF original.</li>
                      <li>Generación de una imagen de código QR con el hash del documento.</li>
                      <li>Incrustación de esta imagen QR directamente en la primera página del PDF, en la posición que el usuario arrastró en la interfaz.</li>
                      <li>Firma digital del hash del documento con la clave privada del usuario.</li>
                      <li>Guardado del PDF modificado (con QR incrustado) y la información de la firma en el historial local.</li>
                    </ol>
                    <div className="mt-4 bg-blue-100 p-3 rounded-md">
                      <p className="flex items-center gap-2 text-blue-800 text-xs">
                        <Info size={14} />
                        El PDF resultante puede ser impreso para llevar el QR de verificación en el documento físico.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECCIÓN 3: VERIFICACIÓN DE FIRMAS DE DOCUMENTOS EN HISTORIAL */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <CheckCircle2 className="text-purple-600" size={28} />
              <h2 className="text-2xl font-semibold">Verificación de Firmas de Documentos en Historial</h2>
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

          {/* NUEVA SECCIÓN 4: VERIFICACIÓN MEDIANTE ESCANEO QR */}
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <QrCode className="text-blue-600" size={28} /> {/* O el color que desees */}
              <h2 className="text-2xl font-semibold">Verificación de Documentos Mediante Escaneo QR</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <Camera size={20} />
                  Opciones de Escaneo
                </h3>
                <div className="space-y-4 text-sm">
                  <p>Esta funcionalidad te permite verificar la autenticidad de un documento físico o digital que contenga un código QR de firma.</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="flex items-center gap-1"><Camera size={16} /> Escaneo con Cámara:</strong> Usa la cámara de tu dispositivo para leer el QR directamente desde un documento impreso.</li>
                    <li><strong className="flex items-center gap-1"><UploadCloud size={16} /> Subir Imagen de QR:</strong> Sube una imagen (JPEG, PNG) que contenga un código QR (ej. una captura de pantalla).</li>
                    <li><strong className="flex items-center gap-1"><FileText size={16} /> Escanear QR en PDF:</strong> Carga un archivo PDF; la aplicación escaneará automáticamente las páginas para buscar y leer códigos QR.</li>
                  </ul>
                  <div className="mt-4 bg-blue-100 p-3 rounded-md">
                    <p className="flex items-center gap-2 text-blue-800 text-xs">
                      <Info size={14} />
                      El sistema buscará el hash extraído del QR en tu historial de firmas local para verificar la coincidencia.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} />
                  Resultados de Verificación
                </h3>
                {/* Si tienes una imagen para el QR Scanner, úsala aquí */}
                {/* <img src="/imagenes/qr_scanner_result.png" alt="Resultado de escaneo QR" className="mb-4 rounded-lg shadow" /> */}
                <div className="space-y-2 text-sm">
                  <p>Una vez escaneado el código QR, la aplicación buscará el hash correspondiente en tu historial de documentos firmados:</p>
                  <p>✅ <strong>Documento Encontrado y Válido:</strong> Si el hash coincide con una entrada en tu historial y la firma es válida, se mostrará un mensaje de éxito con los detalles del documento (nombre, firmante, fecha).</p>
                  <p>❌ <strong>Documento No Encontrado / Inválido:</strong> Si el hash no se encuentra en tu historial local o la firma es inválida, se te notificará que la verificación falló.</p>
                  <div className="mt-4 bg-yellow-50 p-4 rounded-md">
                    <p className="flex items-center gap-2">
                      <ShieldAlert size={16} />
                      <strong>Importante:</strong> Esta verificación depende del historial local del navegador. Para una verificación oficial completa, el historial debería estar en una base de datos centralizada.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LA ANTIGUA SECCIÓN 4 AHORA ES SECCIÓN 5: HISTORIAL */}
          <section>
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <History className="text-orange-600" size={28} />
              <h2 className="text-2xl font-semibold">Gestión de Historial de Documentos</h2>
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