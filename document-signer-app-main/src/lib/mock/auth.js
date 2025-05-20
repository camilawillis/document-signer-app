const USUARIOS_DIF = [
  {
    email: "admin@dif.gob.mx",
    password: "admin123",
    nombre: "Administrador DIF",
    rol: "administrador"
  },
  {
    email: "firmante@dif.gob.mx",
    password: "firmante123",
    nombre: "Firmante Autorizado",
    rol: "firmante"
  }
];

export const autenticarUsuario = (email, password) => {
  const usuario = USUARIOS_DIF.find(u => 
    u.email === email && u.password === password
  );
  
  if (!usuario || !email.endsWith('@dif.gob.mx')) {
    throw new Error("Credenciales inválidas o dominio no autorizado");
  }
  
  // Limpiar cualquier sesión anterior
  localStorage.removeItem(`userKeyPair_${email}`);
  localStorage.setItem("usuarioDIF", JSON.stringify(usuario));
  
  // Generar par de llaves si no existe
  generarLlavesParaUsuario(email);
  
  return usuario;
};

export const cerrarSesion = () => {
  const usuario = JSON.parse(localStorage.getItem("usuarioDIF"));
  if (usuario) {
    localStorage.removeItem(`userKeyPair_${usuario.email}`);
    localStorage.removeItem("usuarioDIF");
  }
};

const generarLlavesParaUsuario = async (email) => {
  // Verificar si ya tiene llaves generadas
  if (localStorage.getItem(`userKeyPair_${email}`)) return;

  try {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-PSS",
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-512"
      },
      true,
      ["sign", "verify"]
    );
    
    // Exportar las llaves en formato JWK
    const publicKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.publicKey);
    const privateKeyJwk = await window.crypto.subtle.exportKey("jwk", keyPair.privateKey);
    
    // Guardar las llaves en localStorage
    localStorage.setItem(`userKeyPair_${email}`, JSON.stringify({
      publicKeyJwk,
      privateKeyJwk,
      expira: Date.now() + 365 * 86400e3 // 1 año de validez
    }));
    
    console.log("Llaves generadas y guardadas para:", email);
  } catch (error) {
    console.error("Error al generar llaves:", error);
  }
};

