import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadCloud, CheckCircle, ArrowLeft, Key, FileText, PieChart } from 'lucide-react';
import Card from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { getDocument } from "pdfjs-dist";
import QRCode from 'qrcode';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
pdfjsLib.GlobalWorkerOptions.workerSrc = 
  `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


const DOCUMENT_TYPES = [
    { id: 'acta-matrimonio', name: 'Acta de Matrimonio' },
    { id: 'acta-nacimiento', name: 'Acta de Nacimiento' },
    { id: 'identificacion', name: 'Identificación Oficial' },
    { id: 'otros', name: 'Otros Documentos' }
];

export default function DocumentSigner() {
    const [publicKey, setPublicKey] = useState(null);
    const [privateKey, setPrivateKey] = useState(null);
    const [recentDocuments, setRecentDocuments] = useState([]);
    const [status, setStatus] = useState({ message: 'No hay archivo cargado', type: 'info' });
    const [importedPublicKey, setImportedPublicKey] = useState(null);
    const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0].id);
    const [stats, setStats] = useState(null);
    const [selectedSignature, setSelectedSignature] = useState(null);
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [qrPosition, setQrPosition] = useState({ x: 100, y: 100 });
    const [dragging, setDragging] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);
    const canvasRef = useRef(null);
    const qrRef = useRef(null);
    const offset = useRef({ x: 0, y: 0 });
    
    const puedeFirmar = usuario.rol === 'firmante' || usuario.rol === 'administrador';

    const initializeApp = useCallback(async () => {
    try {
        if (window.isSecureContext === false && window.location.hostname !== 'localhost') {
            throw new Error('Se requiere HTTPS o localhost para las operaciones criptográficas');
        }

        const userKey = `userKeyPair_${usuario.email}`;
        const storedKeys = localStorage.getItem(userKey);
        
        if (storedKeys) {
            try {
                const { publicKeyJwk, privateKeyJwk } = JSON.parse(storedKeys);
                
                const [publicKey, privateKey] = await Promise.all([
                    window.crypto.subtle.importKey(
                        'jwk',
                        publicKeyJwk,
                        { name: 'RSA-PSS', hash: 'SHA-512' },
                        true,
                        ['verify']
                    ),
                    window.crypto.subtle.importKey(
                        'jwk',
                        privateKeyJwk,
                        { name: 'RSA-PSS', hash: 'SHA-512' },
                        true,
                        ['sign']
                    )
                ]);
                
                setPublicKey(publicKey);
                setPrivateKey(privateKey);
            } catch (importError) {
                console.warn('Error importando claves guardadas, generando nuevas', importError);
                throw new Error('regenerar');
            }
        } else {
            throw new Error('regenerar');
        }
    } catch (error) {
        if (error.message === 'regenerar') {
            try {
                const newKeyPair = await window.crypto.subtle.generateKey(
                    {
                        name: 'RSA-PSS',
                        modulusLength: 4096,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: 'SHA-512',
                    },
                    true,
                    ['sign', 'verify']
                );

                const [publicKeyJwk, privateKeyJwk] = await Promise.all([
                    window.crypto.subtle.exportKey('jwk', newKeyPair.publicKey),
                    window.crypto.subtle.exportKey('jwk', newKeyPair.privateKey)
                ]);

                localStorage.setItem(`userKeyPair_${usuario.email}`, JSON.stringify({
                    publicKeyJwk,
                    privateKeyJwk
                }));

                setPublicKey(newKeyPair.publicKey);
                setPrivateKey(newKeyPair.privateKey);
            } catch (genError) {
                console.error('Error generando claves:', genError);
                setStatus({ 
                    message: 'Error inicializando el sistema criptográfico', 
                    type: 'error' 
                });
                return;
            }
        } else {
            console.error('Error inicializando:', error);
            setStatus({ 
                message: error.message || 'Error inicializando el sistema', 
                type: 'error' 
            });
            return;
        }
    }

    try {
        loadHistory();
        calculateStats();
        setStatus({ message: 'Sistema listo', type: 'success' });
    } catch (loadError) {
        console.error('Error cargando historial:', loadError);
        setStatus({ 
            message: 'Aún no hay documentos firmados', 
            type: 'error' 
        });
    }
    }, [usuario.email]); // 👈 aquí va el dependency correcto

    useEffect(() => {
        initializeApp();
    }, [initializeApp]);

    useEffect(() => {
        if (pdfUrl) {
            const renderPdf = async () => {
                try {
                    const loadingTask = getDocument(pdfUrl);
                    const pdf = await loadingTask.promise;
                    const page = await pdf.getPage(1);

                    const canvas = canvasRef.current;
                    const context = canvas.getContext("2d");

                    const viewport = page.getViewport({ scale: 1 });
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    await page.render({ canvasContext: context, viewport }).promise;
                } catch (error) {
                    console.error('Error al renderizar el PDF:', error);
                }
            };
            renderPdf();
        }
    }, [pdfUrl]);

    const loadHistory = () => {
        const storedHistory = JSON.parse(localStorage.getItem('documentHistory') || '[]');
        setRecentDocuments(storedHistory.slice(0, 3));
    };

    const calculateStats = () => {
        const storedHistory = JSON.parse(localStorage.getItem('documentHistory') || '[]');
        const stats = {
            total: storedHistory.length,
            byType: DOCUMENT_TYPES.reduce((acc, type) => {
                acc[type.id] = storedHistory.filter(doc => doc.type === type.id).length;
                return acc;
            }, {}),
            last30Days: storedHistory.filter(doc => {
                const docDate = new Date(doc.timestamp);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return docDate >= thirtyDaysAgo;
            }).length
        };
        setStats(stats);
    };
    
    const handleFileUpload = async (file, qrPosition) => {
        if (!puedeFirmar) {
            setStatus({ message: 'No tienes permisos para firmar documentos', type: 'error' });
            return;
        }

        if (!file || file.size > 10 * 1024 * 1024) {
            setStatus({ message: 'El archivo es demasiado grande (máx. 10MB)', type: 'error' });
            return;
        }

        try {
            setStatus({ message: 'Firmando documento...', type: 'loading' });

            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);
            const fileHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

            const signature = await window.crypto.subtle.sign(
                { name: "RSA-PSS", saltLength: 128 },
                privateKey,
                hashBuffer
            );

            const signatureHex = Array.from(new Uint8Array(signature))
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');

            const newEntry = {
                fileName: file.name,
                timestamp: Date.now(),
                expiration: Date.now() + (365 * 24 * 60 * 60 * 1000)/2, // 6 meses
                status: "Firmado y verificado",
                signature: signatureHex,
                size: (file.size / 1024).toFixed(2) + ' KB',
                signedBy: usuario.nombre,
                publicKey: await exportPublicKey(),
                fileHash: fileHash,
                fileUrl: URL.createObjectURL(new Blob([arrayBuffer], { type: 'application/pdf' }))
            };


            const pngImageBytes = await new Promise((resolve, reject) => {
                QRCode.toDataURL(fileHash, { width: 200 }, (err, url) => {
                    if (err) return reject(err);
                    fetch(url)
                        .then(res => res.arrayBuffer())
                        .then(resolve)
                        .catch(reject);
                });
            });

            const url = newEntry.fileUrl;
            const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer());
            const pdfDoc = await PDFDocument.load(existingPdfBytes);

            const pngImage = await pdfDoc.embedPng(pngImageBytes);
            const pngDims = pngImage.scale(0.5);

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const canvas = canvasRef.current;
            const { width: pdfWidth, height: pdfHeight } = firstPage.getSize();

            // Escalamos posición del QR a coordenadas del PDF
            const scaleX = pdfWidth / canvas.width;
            const scaleY = pdfHeight / canvas.height;

            // Invertimos el eje Y porque el PDF tiene el origen abajo
            const pdfX = qrPosition.x * scaleX;
            const pdfY = pdfHeight - (qrPosition.y * scaleY + pngDims.height); // Considera la altura del QR

            firstPage.drawImage(pngImage, {
                x: pdfX,
                y: pdfY,
                width: pngDims.width,
                height: pngDims.height,
            });


            const pdfBytes = await pdfDoc.save();

            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const modifiedFileUrl = URL.createObjectURL(blob);

            newEntry.fileUrl = modifiedFileUrl;

            const updatedHistory = [newEntry, ...JSON.parse(localStorage.getItem('documentHistory') || '[]')];
            localStorage.setItem('documentHistory', JSON.stringify(updatedHistory));

            loadHistory();
            calculateStats();

            setStatus({
                message: `Documento ${file.name} firmado exitosamente`,
                type: 'success'
            });

        } catch (error) {
            console.error('Error firmando documento:', error);
            setStatus({ message: 'Error en el proceso de firma', type: 'error' });
        }
    };



    const verifySignature = async (entry) => {
        try {
            const key = importedPublicKey || publicKey;
            if (!key) throw new Error('No hay clave pública disponible');

            const signatureArray = new Uint8Array(
                entry.signature.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
            );

            const storedHistory = JSON.parse(localStorage.getItem('documentHistory') || []);
            const originalEntry = storedHistory.find(doc => doc.signature === entry.signature);
            
            if (!originalEntry) {
                throw new Error('Documento original no encontrado');
            }

            const verificationContent = new TextEncoder().encode(
                `${originalEntry.fileName}:${originalEntry.fileHash}`
            ).buffer;

            const isValid = await window.crypto.subtle.verify(
                { name: "RSA-PSS", saltLength: 128 },
                key,
                signatureArray,
                verificationContent
            );

            return isValid;
        } catch (error) {
            console.error('Error verificando firma:', error);
            return false;
        }
    };

    const handlePreview = async (entry) => {
        try {
            const isValid = await verifySignature(entry); // Esperamos la promesa correctamente
            setSelectedSignature({
                ...entry,
                isValid // Valor booleano, no promesa
            });
        } catch (error) {
            console.error('Error generando vista previa:', error);
            setStatus({ message: 'Error al generar vista previa', type: 'error' });
        }
    };


    const exportPublicKey = async () => {
        if (!publicKey) return null;
        const exported = await window.crypto.subtle.exportKey('spki', publicKey);
        const pem = `-----BEGIN PUBLIC KEY-----\n${btoa(String.fromCharCode(...new Uint8Array(exported)))}\n-----END PUBLIC KEY-----`;
        return pem;
    };

    const downloadPublicKey = async () => {
        try {
            const pem = await exportPublicKey();
            if (!pem) {
                setStatus({ message: 'No hay clave pública disponible', type: 'error' });
                return;
            }
            const blob = new Blob([pem], { type: 'application/x-pem-file' });
            saveAs(blob, `public_key_${usuario.email}.pem`);
            setStatus({ message: 'Clave pública exportada', type: 'success' });
        } catch (error) {
            console.error('Error exportando clave pública:', error);
            setStatus({ message: 'Error exportando clave', type: 'error' });
        }
    };

    const handlePublicKeyImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const pemContents = e.target.result;
                const pemHeader = "-----BEGIN PUBLIC KEY-----";
                const pemFooter = "-----END PUBLIC KEY-----";
                const pemContentsBase64 = pemContents
                    .replace(pemHeader, '')
                    .replace(pemFooter, '')
                    .replace(/\s+/g, '');

                const binaryDerString = window.atob(pemContentsBase64);
                const binaryDer = new Uint8Array(binaryDerString.length);
                for (let i = 0; i < binaryDerString.length; i++) {
                    binaryDer[i] = binaryDerString.charCodeAt(i);
                }

                const key = await window.crypto.subtle.importKey(
                    'spki',
                    binaryDer,
                    { name: 'RSA-PSS', hash: 'SHA-512' },
                    true,
                    ['verify']
                );

                setImportedPublicKey(key);
                setStatus({ message: 'Clave pública importada correctamente', type: 'success' });
            } catch (error) {
                console.error('Error importando clave pública:', error);
                setStatus({ message: 'Error importando clave pública', type: 'error' });
            }
        };
        reader.readAsText(file);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString('es-MX', {
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit'
        });
    };


    return (
        <div className="flex flex-col items-center gap-6 p-6">
            {/* Encabezado */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-4">
                <Button 
                    onClick={() => navigate('/')}
                    variant="ghost"
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                >
                    <ArrowLeft size={18} /> Volver al panel
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">Firmar Documentos</h1>
                <div className="flex gap-2">
                    <Button 
                        onClick={downloadPublicKey}
                        variant="outline"
                        className="flex items-center gap-2"
                        title="Exportar clave pública"
                    >
                        <Key size={18} />
                        <span className="hidden md:inline">Exportar Clave</span>
                    </Button>
                    <label className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <Key size={18} className="text-gray-700" />
                        <span className="hidden md:inline">Importar Clave</span>
                        <input 
                            type="file" 
                            className="hidden" 
                            accept=".pem"
                            onChange={handlePublicKeyImport}
                        />
                    </label>
                </div>
            </div>
            
            {/* Estadísticas */}
            {stats && (
                <Card className="w-full max-w-4xl">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <PieChart className="text-blue-500" />
                            <h2 className="text-lg font-semibold">Estadísticas</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-700">Total firmados</p>
                                <p className="text-2xl font-bold">{stats.total}</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <p className="text-sm text-green-700">Últimos 30 días</p>
                                <p className="text-2xl font-bold">{stats.last30Days}</p>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-lg">
                                <p className="text-sm text-purple-700">Tipos de documentos</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {DOCUMENT_TYPES.map(type => (
                                        <span key={type.id} className="text-xs bg-white px-2 py-1 rounded">
                                            {type.name}: {stats.byType[type.id] || 0}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Formulario de firma */}
            <Card className="w-full max-w-4xl">
                <CardContent className="p-6">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipo de Documento
                            </label>
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                            >
                                {DOCUMENT_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="w-full">
                            <p className="text-gray-600 mb-4 text-center">
                                Sube un documento PDF y arrastra el código QR donde lo quieras colocar
                            </p>

                            {/* Input de archivo */}
                            <label className="flex flex-col items-center gap-3 cursor-pointer p-8 border-2 border-dashed border-blue-300 rounded-xl hover:bg-blue-50 transition-colors">
                                <UploadCloud size={48} className="text-blue-500" />
                                <span className="font-medium text-blue-600">Seleccionar archivo PDF</span>
                                <span className="text-sm text-gray-500">Tamaño máximo: 10MB</span>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept=".pdf" 
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            if (file.type !== 'application/pdf') {
                                                setStatus({ message: 'El archivo debe ser un PDF', type: 'error' });
                                                return;
                                            }
                                            if (file.size > 10 * 1024 * 1024) {
                                                setStatus({ message: 'El archivo es demasiado grande (máx. 10MB)', type: 'error' });
                                                return;
                                            }
                                            setSelectedFile(file);
                                            const url = URL.createObjectURL(file);
                                            setPdfUrl(url);
                                        }
                                    }}
                                />
                            </label>
                            {/* Vista previa PDF con QR movible */}
                            {pdfUrl && (
                            <div
                                className="relative mt-4 w-full overflow-auto"
                                style={{ maxHeight: '600px', padding: 0, margin: 0, border: 'none', position: 'relative' }}
                                onMouseMove={(e) => {
                                if (!dragging) return;
                                const canvas = canvasRef.current;
                                const rect = canvas.getBoundingClientRect();

                                // Calcula posición sin que se salga del canvas (100 = tamaño QR)
                                let newX = e.clientX - rect.left - offset.current.x;
                                let newY = e.clientY - rect.top - offset.current.y;

                                // Limita el QR para que no se salga del canvas
                                newX = Math.max(0, Math.min(newX, canvas.width - 100));
                                newY = Math.max(0, Math.min(newY, canvas.height - 100));

                                setQrPosition({
                                    x: newX,
                                    y: newY,
                                });
                                }}
                                onMouseUp={() => setDragging(false)}
                            >
                                <canvas ref={canvasRef} />

                                <img
                                ref={qrRef}
                                src={`https://api.qrserver.com/v1/create-qr-code/?data=qr-preview&size=100x100`}
                                alt="QR"
                                draggable={false}
                                onMouseDown={(e) => {
                                    setDragging(true);
                                    const rect = e.target.getBoundingClientRect();
                                    offset.current = {
                                    x: e.clientX - rect.left,
                                    y: e.clientY - rect.top,
                                    };
                                }}
                                style={{
                                    position: "absolute",
                                    top: qrPosition.y,
                                    left: qrPosition.x,
                                    width: 100,
                                    height: 100,
                                    cursor: "move",
                                    zIndex: 10,
                                }}
                                />
                            </div>
                            )}


                            <p className="text-sm text-gray-500">
                            selectedFile: {selectedFile ? selectedFile.name : 'ninguno'}
                            </p>

                            {/* Botón de firmar */}
                            {selectedFile && (
                                
                                <div className="text-center mt-6 flex justify-center gap-4">
                                    <Button 
                                    onClick={() => handleFileUpload(selectedFile, qrPosition)} 
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                                    >
                                    Firmar Documento
                                    </Button>

                                    <Button
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setPdfUrl(null);
                                        setQrPosition({ x: 0, y: 0 }); // opcional: reinicia la posición del QR
                                        setStatus({ message: 'Firma cancelada.', type: 'default' });
                                    }}
                                    className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                                    >
                                    Cancelar
                                    </Button>
                                </div>
                            )}
                        </div>


                        <div className={`w-full p-4 rounded-lg text-center ${
                            status.type === 'error' ? 'bg-red-100 text-red-700' :
                            status.type === 'success' ? 'bg-green-100 text-green-700' :
                            status.type === 'loading' ? 'bg-blue-100 text-blue-700' : 
                            'bg-gray-100 text-gray-700'
                        }`}>
                            {status.type === 'loading' ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700"></div>
                                    {status.message}
                                </div>
                            ) : (
                                status.message
                            )}
                        </div>

                        {recentDocuments.length > 0 && (
                            <div className="w-full">
                                <h3 className="font-semibold text-gray-700 mb-3">
                                    Documentos recientes ({recentDocuments.length})
                                </h3>
                                <div className="space-y-3">
                                    {recentDocuments.map((doc, index) => (
                                        <div 
                                            key={index} 
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{doc.fileName}</p>
                                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-500">
                                                    <span>{formatDate(doc.timestamp)}</span>
                                                    <span>•</span>
                                                    <span>{doc.size}</span>
                                                    <span>•</span>
                                                    <span className="truncate">{doc.signedBy}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <CheckCircle className="text-green-500 flex-shrink-0" />
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handlePreview(doc)}
                                                    title="Verificar firma y vista previa"
                                                >
                                                    <FileText size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-3 text-right">
                                    <Button 
                                        variant="link" 
                                        onClick={() => navigate('/historial')}
                                        className="text-blue-600"
                                    >
                                        Ver historial completo →
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Modal de vista previa */}
            {selectedSignature && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">Detalles del Documento Firmado</h3>
                <button 
                    onClick={() => setSelectedSignature(null)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Vista previa PDF con iframe */}
                <div className="border rounded-lg p-2">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Vista Previa</h4>
                        <a 
                            href={selectedSignature.fileUrl} 
                            download={selectedSignature.fileName}
                            className="text-blue-600 text-sm hover:text-blue-800"
                        >
                            Descargar
                        </a>
                    </div>
                    <div className="h-96">
                        <iframe 
                            src={selectedSignature.fileUrl} 
                            className="w-full h-full border rounded"
                            title="Vista previa del documento"
                        />
                    </div>
                </div>
                
                {/* Detalles de firma */}
                <div>
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-1">Documento:</h4>
                        <p className="text-gray-900 break-all">{selectedSignature.fileName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
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
                            <h4 className="font-medium text-gray-700 mb-1">Tipo:</h4>
                            <p className="text-gray-900">
                                {DOCUMENT_TYPES.find(t => t.id === selectedSignature.type)?.name || 'Desconocido'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Tamaño:</h4>
                            <p className="text-gray-900">{selectedSignature.size}</p>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-700 mb-1">Firmado por:</h4>
                            <p className="text-gray-900">{selectedSignature.signedBy}</p>
                        </div>
                    </div>

                    
                    <div className="flex flex-col items-center mb-4">
                        <h4 className="font-medium text-gray-700 mb-2" >Hash del Documento (QR):</h4>
                        <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(selectedSignature.fileHash)}&size=200x200`} 
                            alt="Código QR del Hash del Documento" 
                            className="border p-2 rounded-lg bg-white"
                        />
                    </div>
                    
                    <div className="mb-4">
                        <h4 className="font-medium text-gray-700 mb-1">Firma Digital:</h4>
                        <div className="text-xs bg-gray-100 p-3 rounded-lg overflow-auto max-h-24">
                            <code className="break-all">{selectedSignature.signature}</code>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setSelectedSignature(null)}
                            className="border-gray-300 hover:bg-gray-50"
                        >
                            Cerrar
                        </Button>
                        <Button 
                            onClick={() => {
                                navigator.clipboard.writeText(selectedSignature.signature);
                                setStatus({
                                    message: 'Firma copiada al portapapeles',
                                    type: 'success'
                                });
                                setTimeout(() => setSelectedSignature(null), 1000);
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Copiar firma
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
)}
        </div>
    );
}