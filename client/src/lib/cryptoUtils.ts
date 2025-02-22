const isBrowser = typeof window !== 'undefined';

const checkCryptoSupport = () => {
  if (!isBrowser || !window.crypto || !window.crypto.subtle) {
    throw new Error('Web Crypto API is not supported in this environment');
  }
};

interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

// Generates RSA-OAEP key pair for asymmetric encryption
const generateKeyPair = async (): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );
};

// Store keys in session storage
const storeKeys = async (keyPair: CryptoKeyPair) => {
  const exportedPublicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const exportedPrivateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  
  const timestamp = Date.now();
  sessionStorage.setItem('keyedin_publickey', btoa(String.fromCharCode(...new Uint8Array(exportedPublicKey))));
  sessionStorage.setItem('keyedin_privatekey', btoa(String.fromCharCode(...new Uint8Array(exportedPrivateKey))));
  sessionStorage.setItem('keyedin_timestamp', timestamp.toString());
};

const shouldRotateKeys = (): boolean => {
  const timestamp = sessionStorage.getItem('keyedin_timestamp');
  if (!timestamp) return true;

  const keyAge = Date.now() - parseInt(timestamp, 10);
  return keyAge > 1 * 60 * 60 * 1000;
};

// Retrieve keys from storage
const getKeysFromStorage = async (): Promise<KeyPair | null> => {
  const publicKeyString = sessionStorage.getItem('keyedin_publickey');
  const privateKeyString = sessionStorage.getItem('keyedin_privatekey');
  
  if (!publicKeyString || !privateKeyString) return null;

  try {
    const publicKeyData = Uint8Array.from(atob(publicKeyString), c => c.charCodeAt(0));
    const privateKeyData = Uint8Array.from(atob(privateKeyString), c => c.charCodeAt(0));
    
    const publicKey = await window.crypto.subtle.importKey(
      'spki',
      publicKeyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['encrypt']
    );

    const privateKey = await window.crypto.subtle.importKey(
      'pkcs8',
      privateKeyData,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['decrypt']
    );

    return { publicKey, privateKey };
  } catch (error) {
    console.error('Error importing keys:', error);
    return null;
  }
};

export const generateAndStoreKeys = async (): Promise<KeyPair> => {
  checkCryptoSupport();
  const keyPair = await generateKeyPair();
  await storeKeys(keyPair);
  return keyPair;
};

export const checkAndRotateKeys = async (): Promise<KeyPair> => {
  if (shouldRotateKeys()) {
    cleanupKeys();
    return await generateAndStoreKeys();
  }

  const existingKeys = await getKeysFromStorage();
  if (!existingKeys) {
    return await generateAndStoreKeys();
  }

  return existingKeys;
};

export const cleanupKeys = () => {
  sessionStorage.removeItem('keyedin_privatekey');
  sessionStorage.removeItem('keyedin_publickey');
  sessionStorage.removeItem('keyedin_timestamp');
};

if (isBrowser) {
  window.addEventListener('load', () => {
    checkAndRotateKeys().catch(console.error);
  });
  window.addEventListener('unload', cleanupKeys);
}
