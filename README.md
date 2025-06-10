# Digital Document Signer App

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-30A3DC?style=for-the-badge&logo=webcomponents&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## Descripción

Aplicación web para firmar y verificar documentos digitalmente utilizando la Web Crypto API del navegador. Permite a los usuarios generar pares de claves (pública/privada), firmar documentos PDF con su clave privada y verificar esas firmas usando la clave pública correspondiente. Las claves y el historial de documentos firmados se almacenan localmente en el navegador.

Este proyecto es una demostración del uso de criptografía en el lado del cliente (browser) con RSA-PSS (SHA-512) para la firma digital.

## Características

* **Generación de Claves:** Crea automáticamente un par de claves RSA-PSS (4096-bit, SHA-512) en el navegador para cada usuario (basado en el contexto de autenticación).
* **Firma de Documentos:** Permite cargar un archivo PDF y firmarlo digitalmente utilizando la clave privada generada localmente.
* **Verificación de Firma:** Verifica la autenticidad de una firma digital asociada a un documento (basado en el hash del contenido), utilizando la clave pública del firmante.
* **Gestión de Claves:**
    * Exporta la clave pública local en formato PEM.
    * Importa claves públicas de terceros (en formato PEM) para verificar sus firmas.
* **Historial Local:** Mantiene un registro de los documentos firmados y sus detalles (nombre, fecha, tamaño, firmante, hash, firma, clave pública) en el `localStorage` del navegador.
* **Estadísticas:** Muestra un resumen básico de la actividad de firma.
* **Previsualización:** Permite ver los detalles de un documento firmado, incluyendo su hash, la firma digital y la clave pública asociada, facilitando la verificación.
* **QR del Hash:** Genera un código QR que contiene el hash del documento para fácil identificación o vinculación.
* **Control Básico de Roles:** Integrado con un contexto `useAuth` para determinar si un usuario tiene permisos de 'firmante'.

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
* Componentes UI (basados en `@/components/ui/card`, `@/components/ui/button`, etc., presumiblemente de una librería como [Shadcn/UI](https://ui.shadcn.com/) o similar)
* API externa para QR: `https://api.qrserver.com/`
* Manejo de estado y contexto (AuthContext)

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
    cd document-signer-app
    ```
    *(Reemplaza `[URL_DEL_TU_REPOSITORIO]` con la URL real de tu repositorio en GitHub u otro servicio).*

2.  **Instala las dependencias:**
    ```bash
    npm install
    # o si usas yarn
    # yarn install
    ```

## Cómo Ejecutar

Una vez instaladas las dependencias, puedes iniciar la aplicación:

```bash
npm run dev
# o si usas yarn
# yarn dev
# o si tu setup usa create-react-app (menos probable con Vite/@):
# npm start 
# o yarn start
