# Digital Document Signer App

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Web Crypto API](https://img.shields.io/badge/Web%20Crypto%20API-30A3DC?style=for-the-badge&logo=webcomponents&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)

## Description

A web application developed as a functional demonstration for digital document signing and verification, designed to simulate an operational environment for institutions such as the DIF. It utilizes the browser's native **Web Crypto API** to manage cryptographic key pairs and perform signing and verification operations, ensuring the integrity and authenticity of documents.

This project empowers staff with the following key capabilities:
* **Digital Document Signing:** Generate and use personal keys to sign PDF documents.
* **QR Code Embedding:** Allows embedding a QR code containing the document's hash directly into the signed PDF, facilitating its printing and subsequent verification.
* **Local History:** Maintains a persistent record of all performed signatures.
* **Versatile Verification:** Offers methods to verify the authenticity of both digital documents (via history) and physical documents (by scanning QR codes).

The project demonstrates the use of client-side cryptography (in-browser) with the **RSA-PSS (SHA-512)** algorithm for digital signing and verification, and expands its utility by integrating physical documents into the verification process.

## Features

* **Key Generation:** Automatically creates an RSA-PSS key pair (4096-bit, SHA-512) in the browser for each authenticated user, managing their lifecycle and local storage.
* **Document Signing with QR Embedding:** Allows uploading a PDF file, calculating its hash, signing it digitally with the locally generated private key, and, crucially, **embedding a QR code with the hash directly into a user-selectable position within the PDF**. This facilitates the printing and subsequent verification of the physical document.
* **Signature Verification (History):** Allows verifying the authenticity of a digital signature associated with a document stored in the local history, using the signer's public key and comparing the original hash.
* **QR Code Reader for Physical Verification:** Provides an interface to scan QR codes from various sources (webcam, local image, or PDF file). The hash extracted from the QR is used to search for and verify the validity of the corresponding document in the local history.
* **Key Management:**
    * Export local public keys in PEM format to share with third parties.
    * Import third-party public keys (PEM format) to verify their signatures.
* **Local History:** Maintains a detailed persistent record of signed documents (name, date, size, signer, hash, signature, public key, and modified document URL) in the browser's localStorage, featuring search and filtering functions.
* **Statistics:** Displays a basic summary of signing activity on the main dashboard for a quick usage overview.
* **Detailed Preview:** View the complete metadata of a signed document, including its hash, digital signature, associated public key, and a QR code of the hash for external verification.
* **Integrated User Manual:** Includes a detailed user manual section within the application covering access, signing processes, QR embedding, verification, and security considerations.
* **Basic Role Control:** Integrated with a useAuth context to simulate user permissions ('Administrator' and 'Signer').

## Important Security Note

**This project is a demonstration and is NOT suitable for storing sensitive private keys or for production use where key security and persistence are critical.**

* Private keys and document history are stored **exclusively** in the browser's localStorage.
* localStorage is not a secure storage mechanism for private keys; it is vulnerable to XSS attacks, and data is lost if the user clears browser data or changes devices.
* For a robust and secure digital signature application, private keys should be managed in secure environments like Hardware Security Modules (HSMs), smart cards, or secure OS keystores, and history should be persisted in a secure server-side database.

## Technologies Used

* [React](https://react.dev/)
* [JavaScript (ES6+)]
* [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
* [Lucide React](https://lucide.dev/icons/) (Icons)
* [React Router DOM](https://reactrouter.com/en/main) (Navigation)
* [FileSaver.js](https://github.com/eligrey/FileSaver.js/) (Client-side file saving)
* [react-qr-scanner](https://www.npmjs.com/package/react-qr-scanner) (Camera-based QR reading)
* [jsQR](https://www.npmjs.com/package/jsqr) (QR detection in images)
* [pdfjs-dist](https://mozilla.github.io/pdf.js/) (PDF rendering for preview and QR scanning in PDFs)
* **[pdf-lib](https://pdf-lib.js.org/)** (To modify and embed elements in PDF files)
* **[qrcode](https://www.npmjs.com/package/qrcode)** (To generate QR codes from data)
* Componentes UI (Based on @/components/ui/card, @/components/ui/button, etc., presumably from [Shadcn/UI](https://ui.shadcn.com/) )
* External API for QR generation: https://api.qrserver.com/
* State and Context Management (AuthContext)
* CRaCO (To customize Create React App configuration)
* Tailwind CSS (Utility-first CSS framework)
* PostCSS and Autoprefixer (CSS Processing)

## Prerequisites

Before installing and running this project, ensure you have the following installed:

* [Node.js](https://nodejs.org/) (version 14 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
* A modern web browser that supports the Web Crypto API.
* **Important:** For the Web Crypto API to function correctly, the application must run under **HTTPS** or on **localhost**. Additionally, you must run the following command: npm install pdfjs-dist@3.11.174 to ensure the compatible version of pdfjs-dist is used.

## Configuration and Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Johannacam/document-signer-app](https://github.com/Johannacam/document-signer-app) # Repository URL
    cd document-signer-app # Name of your project folder
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # o si usas yarn
    # yarn install
    ```

## How to Run

Once the dependencies are installed, you can start the application in development mode:

```bash
npm start
# o si usas yarn
# yarn start
