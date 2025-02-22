export const generateKeyPair = async () => {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );
    return keyPair;
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw error;
  }
};

export const exportPublicKey = async (keyPair: CryptoKeyPair) => {
  const exported = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  return `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
};

export const exportPrivateKey = async (keyPair: CryptoKeyPair) => {
  const exported = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const exportedAsBase64 = btoa(String.fromCharCode(...new Uint8Array(exported)));
  return `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
};

const PRIVATE_KEY_COOKIE = 'private_key';
const PUBLIC_KEY_COOKIE = 'public_key';

export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
};

export const getCookie = (name: string) => {
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=').map(c => c.trim());
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

export const generateAndStoreKeys = async () => {
  const existingPrivateKey = getCookie(PRIVATE_KEY_COOKIE);
  const existingPublicKey = getCookie(PUBLIC_KEY_COOKIE);
  
  if (existingPrivateKey && existingPublicKey) {
    return {
      privateKey: existingPrivateKey,
      publicKey: existingPublicKey
    };
  }

  const keyPair = await generateKeyPair();
  const publicKey = await exportPublicKey(keyPair);
  const privateKey = await exportPrivateKey(keyPair);

  setCookie(PRIVATE_KEY_COOKIE, privateKey);
  setCookie(PUBLIC_KEY_COOKIE, publicKey);

  return { privateKey, publicKey };
};
