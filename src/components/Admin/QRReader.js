// correr "npm install pdfjs-dist@3.11.174", de lo contratio no va a funcionar con la version mas reciente

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'react-qr-scanner';
import {
  ArrowLeft,
  QrCode,
  AlertTriangle,
  Image as ImageIcon,
  Camera,
  FileText,
  ShieldCheck,
  ShieldX,
  Clipboard,
  RefreshCcw,
} from 'lucide-react';
import Button from '@/components/ui/button';
import jsQR from 'jsqr';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


export default function QRScannerPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [validation, setValidation] = useState(null);
  const [matchInfo, setMatchInfo] = useState(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

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
        { name: 'RSA-PSS', saltLength: 128 },
        publicKey,
        signatureArray,
        hashArray.buffer
      );

      return isValid;
    } catch (error) {
      console.error('Error en verificación:', error);
      return false;
    }
  };

  const handleScan = async (data) => {
    if (!data) return;
    const hash = typeof data === 'string'
      ? data
      : (typeof data.data === 'string' ? data.data : (typeof data.text === 'string' ? data.text : ''));
    if (!/^[a-f0-9]{64}$/i.test(hash)) {
      setResult('');
      setValidation(null);
      setError(`El contenido del código QR no parece ser un hash válido. Valor detectado: ${JSON.stringify(data)}`);
      setShowCamera(false);
      return;
    }

    setResult(hash);
    setError('');
    setValidation(null);
    setMatchInfo(null);

    try {
      const history = JSON.parse(localStorage.getItem('documentHistory') || '[]');
      const match = history.find(entry => entry.fileHash === hash);

      if (!match) {
        setError('No se encontró ningún documento con ese hash en el historial.');
        setShowCamera(false);
        return;
      }

      const isValid = await verifySignature(match);
      setValidation(isValid);
      setMatchInfo({
        fileName: match.fileName,
        signedBy: match.signedBy,
        timestamp: match.timestamp,
      });
      setShowCamera(false); // cerrar cámara después del escaneo
    } catch (err) {
      console.error('Error verificando la firma:', err);
      setError('Ocurrió un error durante la verificación.');
      setValidation(null);
      setShowCamera(false);
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError(err.message || 'Error leyendo el código QR');
  };

  const extractQRFromImage = (src) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
      if (code) handleScan(code);
      else {
        setResult('');
        setValidation(null);
        setError('No se detectó ningún código QR en la imagen');
      }
    };
    img.src = src;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => extractQRFromImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handlePDFUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const typedArray = new Uint8Array(e.target.result);
      try {
        const pdf = await getDocument({ data: typedArray }).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) handleScan(code);
        else {
          setResult('');
          setValidation(null);
          setError('No se detectó ningún código QR en el PDF');
        }
      } catch (err) {
        console.error(err);
        setError('Error procesando el PDF'+err);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const restartScan = () => {
    setResult('');
    setError('');
    setValidation(null);
    setMatchInfo(null);
    setShowCamera(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate(-1)} variant="ghost" className="text-white hover:bg-blue-800">
            <ArrowLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold">Escáner de Código QR</h1>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6 border-b pb-4">
              <QrCode className="text-blue-600" size={28} />
              <h2 className="text-2xl font-semibold">Lector de Código QR</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Button onClick={() => setShowCamera(true)} variant="default">
                <Camera className="mr-2" size={20} /> Abrir cámara
              </Button>
              <Button onClick={() => imageInputRef.current.click()} variant="outline">
                <ImageIcon className="mr-2" size={20} /> Escanear desde imagen
              </Button>
              <Button onClick={() => pdfInputRef.current.click()} variant="outline">
                <FileText className="mr-2" size={20} /> Escanear desde PDF
              </Button>
              <input type="file" accept="image/*" ref={imageInputRef} onChange={handleFileUpload} className="hidden" />
              <input type="file" accept="application/pdf" ref={pdfInputRef} onChange={handlePDFUpload} className="hidden" />
            </div>

            {showCamera && (
              <div className="flex justify-center mb-6">
                <QrScanner
                  delay={300}
                  style={{ height: 240, width: 320 }}
                  onError={handleError}
                  onScan={handleScan}
                />
              </div>
            )}

            {result && (
              <div className="bg-green-50 p-4 rounded-lg text-sm text-green-800 mt-4">
                <strong>Hash escaneado:</strong>
                <p className="mt-1 break-words">{result}</p>
                <Button
                  size="sm"
                  className="mt-2"
                  onClick={() => {
                    navigator.clipboard.writeText(result);
                  }}
                >
                  <Clipboard size={16} className="mr-1" /> Copiar hash
                </Button>
              </div>
            )}

            {validation !== null && (
              <div className={`p-4 rounded-lg text-sm mt-4 flex items-center gap-2 ${
                validation ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {validation ? <ShieldCheck size={16} /> : <ShieldX size={16} />}
                <span>Firma {validation ? 'válida' : 'inválida'}</span>
              </div>
            )}

            {matchInfo && (
              <div className="bg-gray-100 mt-4 p-4 rounded text-sm text-gray-800 space-y-2">
                <div><strong>Documento:</strong> {matchInfo.fileName}</div>
                <div><strong>Firmado por:</strong> {matchInfo.signedBy || 'N/A'}</div>
                <div><strong>Fecha:</strong> {new Date(matchInfo.timestamp).toLocaleString()}</div>
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`Documento: ${matchInfo.fileName}\nFirmado por: ${matchInfo.signedBy || 'N/A'}\nFecha: ${new Date(matchInfo.timestamp).toLocaleString()}`);
                  }}
                >
                  <Clipboard size={16} className="mr-1" /> Copiar datos
                </Button>
              </div>
            )}

            {(result || error) && (
              <div className="mt-6">
                <Button variant="secondary" onClick={restartScan}>
                  <RefreshCcw size={16} className="mr-2" /> Escanear otro QR
                </Button>
              </div>
            )}

            {error && (
              <div className="bg-red-50 p-4 rounded-lg text-sm text-red-800 mt-4 flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{error}</span>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
