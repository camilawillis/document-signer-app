import { useState, useEffect } from 'react';
import { Download, Trash2, FileText, Search, ArrowLeft } from 'lucide-react';
import { saveAs } from 'file-saver';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HistorialFirmas() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('documentHistory') || '[]');
        setHistory(storedHistory);
    }, []);

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('es-MX', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    const verifySignature = async (entry) => {
      try {
        const signatureArray = new Uint8Array(
          entry.signature.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
        );

        const pemContents = entry.publicKey
          .replace('-----BEGIN PUBLIC KEY-----', '')
          .replace('-----END PUBLIC KEY-----', '')
          .replace(/\s+/g, '');

        const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));
        
        const publicKey = await window.crypto.subtle.importKey(
          'spki',
          binaryDer,
          { name: 'RSA-PSS', hash: 'SHA-512' },
          true,
          ['verify']
        );

        const hashArray = new Uint8Array(
          entry.fileHash.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
        );

        const isValid = await window.crypto.subtle.verify(
          { name: "RSA-PSS", saltLength: 128 },
          publicKey,
          signatureArray,
          hashArray.buffer
        );

        return isValid;
        
      } catch (error) {
        console.error("Error en verificación:", error);
        return false;
      }
    };

    const handlePreview = async (entry) => {
        try {
            const isValid = await verifySignature(entry);
            setSelectedSignature({
                ...entry,
                isValid
            });
        } catch (error) {
            console.error('Error generando vista previa:', error);
        }
    };

    const clearHistory = () => {
        if (window.confirm('¿Estás seguro de querer borrar todo el historial? Esta acción no se puede deshacer.')) {
            setIsDeleting(true);
            setTimeout(() => {
                setHistory([]);
                localStorage.removeItem('documentHistory');
                setIsDeleting(false);
            }, 500);
        }
    };

    const exportHistory = () => {
        setIsExporting(true);
        setTimeout(() => {
            const blob = new Blob([JSON.stringify(history, null, 2)], { 
                type: 'application/json' 
            });
            saveAs(blob, `historial_firmas_${new Date().toISOString().split('T')[0]}.json`);
            setIsExporting(false);
        }, 500);
    };

    const filteredHistory = history.filter(entry =>
        entry.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatDate(entry.timestamp).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (entry.signedBy && entry.signedBy.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Button 
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                >
                    <ArrowLeft size={18} /> Panel principal
                </Button>
                <div className="text-sm text-gray-500">
                    {usuario.nombre} • {history.length} documento{history.length !== 1 ? 's' : ''}
                </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">Historial de Firmas Digitales</h1>
            <p className="text-gray-600 mb-6">Registro completo de todos los documentos firmados</p>

            <Card className="mb-6">
                <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, fecha o firmante..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                            onClick={exportHistory} 
                            variant="outline"
                            className="flex items-center gap-2"
                            disabled={isExporting || history.length === 0}
                        >
                            {isExporting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            ) : (
                                <Download size={18} />
                            )}
                            Exportar
                        </Button>
                        <Button 
                            onClick={clearHistory} 
                            variant="destructive"
                            className="flex items-center gap-2"
                            disabled={isDeleting || history.length === 0}
                        >
                            {isDeleting ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Trash2 size={18} />
                            )}
                            Borrar todo
                        </Button>
                    </div>
                </div>
            </Card>

            {filteredHistory.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="grid grid-cols-12 bg-gray-50 p-4 border-b font-medium text-gray-600 hidden md:grid">
                        <div className="col-span-4 md:col-span-5">Documento</div>
                        <div className="col-span-3">Fecha</div>
                        <div className="col-span-2">Firmante</div>
                        <div className="col-span-2 md:col-span-1">Tamaño</div>
                        <div className="col-span-1 text-right">Firma</div>
                    </div>
                    
                    {filteredHistory.map((entry, index) => (
                        <div 
                            key={index} 
                            className="grid grid-cols-12 p-4 border-b hover:bg-gray-50 items-center transition-colors"
                        >
                            <div className="col-span-12 md:col-span-5 font-medium truncate mb-2 md:mb-0">
                                {entry.fileName}
                                <div className="md:hidden text-sm text-gray-500 mt-1">
                                    {formatDate(entry.timestamp)} • {entry.size}
                                </div>
                            </div>
                            <div className="hidden md:block col-span-3 text-sm text-gray-500">
                                {formatDate(entry.timestamp)}
                            </div>
                            <div className="hidden md:block col-span-2 text-sm text-gray-500 truncate">
                                {entry.signedBy || 'N/A'}
                            </div>
                            <div className="hidden md:block col-span-1 text-sm text-gray-500">
                                {entry.size || 'N/A'}
                            </div>
                            <div className="col-span-12 md:col-span-1 flex justify-end mt-2 md:mt-0">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handlePreview(entry)}
                                    className="text-blue-600 hover:bg-blue-100"
                                >
                                    <FileText size={18} className="mr-1 md:mr-0" />
                                    <span className="md:hidden ml-1">Ver</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <Card className="text-center p-8">
                    <p className="text-gray-500">
                        {searchTerm ? 
                            'No se encontraron documentos que coincidan con la búsqueda' : 
                            'No hay documentos en el historial'
                        }
                    </p>
                    {history.length > 0 && searchTerm && (
                        <Button 
                            variant="link" 
                            onClick={() => setSearchTerm('')}
                            className="mt-2"
                        >
                            Limpiar búsqueda
                        </Button>
                    )}
                </Card>
            )}

            {selectedSignature && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-2xl w-full animate-fade-in">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg">
                                Verificación de Firma - 
                                <span className={`ml-2 ${selectedSignature.isValid ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedSignature.isValid ? 'VÁLIDA' : 'INVÁLIDA'}
                                </span>
                            </h3>
                            <button onClick={() => setSelectedSignature(null)} className="text-gray-500">✕</button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-700 mb-1">Documento:</h4>
                                <p className="text-gray-900 break-all">{selectedSignature.fileName}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Fecha:</h4>
                                    <p className="text-gray-900">{formatDate(selectedSignature.timestamp)}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Expiración:</h4>
                                    <p className="text-gray-900">
                                        {selectedSignature.expiration 
                                            ? new Date(selectedSignature.expiration).toLocaleDateString('es-MX', {
                                                year: 'numeric', 
                                                month: 'short', 
                                                day: 'numeric'
                                            }) 
                                            : 'No especificada'}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Firmado por:</h4>
                                    <p className="text-gray-900">{selectedSignature.signedBy}</p>
                                </div>
                            </div>
                            
                            {selectedSignature.publicKey && (
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-1">Clave pública:</h4>
                                    <div className="text-xs bg-gray-100 p-2 rounded break-all max-h-20 overflow-y-auto">
                                        {selectedSignature.publicKey.substring(0, 100)}...
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-col items-center">
                                <h4 className="font-medium text-gray-700 mb-2">Hash del Documento (QR):</h4>
                                <img 
                                     src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(selectedSignature.fileHash)}&size=200x200`} 
                                    alt="Código QR de la firma" 
                                    className="border p-1 rounded bg-white"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-2 mt-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => setSelectedSignature(null)}
                                >
                                    Cerrar
                                </Button>
                                <Button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedSignature.signature);
                                        alert('Firma copiada al portapapeles');
                                    }}
                                >
                                    Copiar firma
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}