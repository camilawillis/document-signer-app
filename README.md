# Digital Document Signer App

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-30A3DC?style=for-the-badge&logo=webcomponents&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)

## Descripción

Aplicación web desarrollada como una demostración funcional para la firma y verificación digital de documentos. Utiliza la Web Crypto API nativa del navegador para gestionar pares de claves criptográficas y realizar operaciones de firma y verificación, asegurando la integridad y autenticidad de los documentos.

El proyecto está diseñado para simular un entorno de uso en instituciones como el DIF, donde el personal puede:
* Generar sus propias claves para firmar documentos PDF.
* Mantener un historial local de sus firmas.
* Y, crucialmente, **verificar la veracidad de documentos físicos o digitales** mediante el escaneo de códigos QR incrustados que contienen el hash del documento.

Este proyecto es una demostración del uso de criptografía en el lado del cliente (browser) con RSA-PSS (SHA-512) para la firma digital y su verificación.

## Características

* **Generación de Claves:** Crea automáticamente un par de claves RSA-PSS (4096-bit, SHA-512) en el navegador para cada usuario autenticado.
* **Firma de Documentos:** Permite cargar un archivo PDF y firmarlo digitalmente utilizando la clave privada generada localmente.
* **Verificación de Firma (en Historial):** Verifica la autenticidad de una firma digital asociada a un documento (basado en el hash del contenido) utilizando la clave pública del firmante, al revisar el historial local.
* **Lector de Código QR para Verificación:** Permite escanear códigos QR desde la cámara, una imagen local o un archivo PDF para extraer el hash de un documento. Este hash se compara con el historial local para verificar la veracidad y validez de la firma del documento.
* **Gestión de Claves:**
    * Exporta la clave pública local en formato PEM.
    * Importa claves públicas de terceros (en formato PEM) para verificar sus firmas.
* **Historial Local:** Mantiene un registro persistente de los documentos firmados y sus detalles (nombre, fecha, tamaño, firmante, hash, firma, clave pública) en el `localStorage` del navegador.
* **Estadísticas:** Muestra un resumen básico de la actividad de firma en el panel principal.
* **Previsualización Detallada:** Permite ver los metadatos completos de un documento firmado, su hash, la firma digital, la clave pública asociada y un código QR del hash para facilitar la verificación externa.
* **Manual de Usuario Integrado:** Incluye una sección de manual de usuario dentro de la aplicación con información sobre el acceso, los procesos de firma y verificación, y consideraciones de seguridad.
* **Control Básico de Roles:** Integrado con un contexto `useAuth` para simular permisos de usuario.

## Nota Importante de Seguridad

**Este proyecto es una demostración y NO es adecuado para almacenar claves privadas sensibles ni para uso en producción donde la seguridad y persistencia de las claves sean críticas.**

* Las claves privadas y el historial de documentos se almacenan **únicamente** en el `localStorage` del navegador.
* El `localStorage` no es un mecanismo de almacenamiento seguro para claves privadas; es vulnerable a ataques XSS y la información se pierde si el usuario limpia los datos del navegador.
* Para una aplicación de firma digital robusta y segura, las claves privadas deben ser gestionadas en entornos seguros como módulos de seguridad de hardware (HSMs), smart cards o keystores seguros del sistema operativo, y el historial debe ser persistente en una base de datos segura en el servidor.

## Tecnologías Utilizadas

* [React](https://react.dev/)
* [JavaScript (ES6+)]
* [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
* [Lucide React](https://lucide.dev/icons/) (Iconos)
* [React Router DOM](https://reactrouter.com/en/main) (Navegación)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/) (Guardar archivos en el cliente)
* [react-qr-scanner](https://www.npmjs.com/package/react-qr-scanner) (Lectura de QR con cámara)
* [jsQR](https://www.npmjs.com/package/jsqr) (Detección de QR en imágenes)
* [pdfjs-dist](https://mozilla.github.io/pdf.js/) (Renderizado de PDF para escaneo de QR)
* Componentes UI (basados en `@/components/ui/card`, `@/components/ui/button`, etc., presumiblemente de una librería como [Shadcn/UI](https://ui.shadcn.com/) o similar)
* API externa para generación de QR: `https://api.qrserver.com/` (para QR de hash en la pantalla de previsualización)
* Manejo de estado y contexto (AuthContext)
* CRaCO (para personalizar la configuración de Create React App)
* Tailwind CSS (Framework CSS utility-first)
* PostCSS y Autoprefixer (Procesamiento de CSS)

## Requisitos Previos

Antes de instalar y ejecutar este proyecto, asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (versión 14 o superior recomendada)
* [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) (administrador de paquetes)
* Un navegador web moderno que soporte la Web Crypto API.
* **Importante:** Para que la Web Crypto API funcione correctamente, la aplicación debe ejecutarse bajo **HTTPS** o en **`localhost`**.

## Configuración e Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clona el repositorio:**
    ```bash
    git clone [URL_DEL_TU_REPOSITORIO]
    cd digital-document-signer-app # Asume el nombre de la carpeta de tu proyecto
    ```
    *(Reemplaza `[URL_DEL_TU_REPOSITORIO]` con la URL real de tu repositorio en GitHub u otro servicio).*

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas yarn
    # yarn install
    ```

## Cómo Ejecutar

Una vez instaladas las dependencias, puedes iniciar la aplicación en modo de desarrollo:

```bash
npm start
# o si usas yarn
# yarn start
