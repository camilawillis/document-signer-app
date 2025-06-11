# Digital Document Signer App

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-30A3DC?style=for-the-badge&logo=webcomponents&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)

## Descripción

Aplicación web desarrollada como una demostración funcional para la firma y verificación digital de documentos, diseñada para simular un entorno operativo en instituciones como el DIF. Utiliza la Web Crypto API nativa del navegador para gestionar pares de claves criptográficas y realizar operaciones de firma y verificación, asegurando la integridad y autenticidad de los documentos.

Este proyecto empodera al personal con las siguientes capacidades clave:
* **Firma de Documentos Digitales:** Genera y utiliza claves propias para firmar documentos PDF.
* **Incrustación de Códigos QR:** Permite incrustar un código QR con el hash del documento directamente en el PDF firmado, facilitando su impresión y verificación posterior.
* **Historial Local:** Mantiene un registro persistente de todas las firmas realizadas.
* **Verificación Versátil:** Ofrece métodos para verificar la autenticidad de documentos tanto digitales (a través del historial) como físicos (mediante el escaneo de códigos QR).

El proyecto demuestra el uso de criptografía del lado del cliente (en el navegador) con el algoritmo RSA-PSS (SHA-512) para la firma y verificación digital, y expande su utilidad al integrar los documentos físicos en el proceso de verificación.

## Características

* **Generación de Claves:** Crea automáticamente un par de claves RSA-PSS (4096-bit, SHA-512) en el navegador para cada usuario autenticado, gestionando su ciclo de vida y almacenamiento local.
* **Firma de Documentos con Incrustación de QR:** Permite cargar un archivo PDF, calcular su hash, firmarlo digitalmente con la clave privada generada localmente y, crucialmente, **incrustar un código QR con el hash del documento directamente en una posición seleccionable por el usuario dentro del PDF**. Esto facilita la impresión y posterior verificación del documento físico.
* **Verificación de Firma (en Historial):** Permite verificar la autenticidad de una firma digital asociada a un documento almacenado en el historial local, utilizando la clave pública del firmante y comparando el hash original.
* **Lector de Código QR para Verificación de Documentos Físicos:** Proporciona una interfaz para escanear códigos QR desde diversas fuentes (cámara web, imagen local o archivo PDF). El hash extraído del QR se utiliza para buscar y verificar la veracidad del documento correspondiente en el historial local.
* **Gestión de Claves:**
    * Exporta la clave pública local en formato PEM para compartirla con terceros.
    * Importa claves públicas de terceros (en formato PEM) para verificar sus firmas.
* **Historial Local:** Mantiene un registro persistente y detallado de los documentos firmados (nombre, fecha, tamaño, firmante, hash, firma, clave pública y URL del documento modificado) en el `localStorage` del navegador, con funciones de búsqueda y filtrado.
* **Estadísticas:** Muestra un resumen básico de la actividad de firma en el panel principal para una visión rápida del uso.
* **Previsualización Detallada:** Permite ver los metadatos completos de un documento firmado, incluyendo su hash, la firma digital, la clave pública asociada y un código QR del hash para facilitar la verificación externa.
* **Manual de Usuario Integrado:** Incluye una sección de manual de usuario detallada dentro de la aplicación con información sobre el acceso, los procesos de firma, la incrustación de QR, la verificación y consideraciones de seguridad.
* **Control Básico de Roles:** Integrado con un contexto `useAuth` para simular permisos de usuario ('Administrador' y 'Firmante').

## Nota Importante de Seguridad

**Este proyecto es una demostración y NO es adecuado para almacenar claves privadas sensibles ni para uso en producción donde la seguridad y persistencia de las claves sean críticas.**

* Las claves privadas y el historial de documentos se almacenan **únicamente** en el `localStorage` del navegador.
* El `localStorage` no es un mecanismo de almacenamiento seguro para claves privadas; es vulnerable a ataques XSS y la información se pierde si el usuario limpia los datos del navegador o cambia de dispositivo.
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
* [pdfjs-dist](https://mozilla.github.io/pdf.js/) (Renderizado de PDF para previsualización y escaneo de QR en PDF)
* **[pdf-lib](https://pdf-lib.js.org/)** (Para modificar y incrustar elementos en archivos PDF)
* **[qrcode](https://www.npmjs.com/package/qrcode)** (Para generar códigos QR a partir de datos)
* Componentes UI (basados en `@/components/ui/card`, `@/components/ui/button`, etc., presumiblemente de una librería como [Shadcn/UI](https://ui.shadcn.com/) o similar)
* API externa para generación de QR: `https://api.qrserver.com/` (para QR de hash en la pantalla de previsualización y vista previa del arrastre del QR)
* Manejo de estado y contexto (AuthContext)
* CRaCO (para personalizar la configuración de Create React App)
* Tailwind CSS (Framework CSS utility-first)
* PostCSS y Autoprefixer (Procesamiento de CSS)

## Requisitos Previos

Antes de instalar y ejecutar este proyecto, asegúrate de tener instalado:

* [Node.js](https://nodejs.org/) (versión 14 o superior recomendada)
* [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/) (administrador de paquetes)
* Un navegador web moderno que soporte la Web Crypto API.
* **Importante:** Para que la Web Crypto API funcione correctamente, la aplicación debe ejecutarse bajo **HTTPS** o en **`localhost`**. Además se debe ejecutar el comando
  ```bash
  npm install pdfjs-dist@3.11.174
  ```
  para tener la versión compatible de pdfjs-dist

## Configuración e Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/Johannacam/document-signer-app](https://github.com/Johannacam/document-signer-app) # URL del repositorio
    cd document-signer-app # Nombre de la carpeta de tu proyecto
    ```

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
