const getDeviceFingerprint = async (): Promise<string> => {
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency
  ].join('|');

  // Create a hash of the fingerprint
  const msgBuffer = new TextEncoder().encode(fingerprint);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
};

// Generate AES key from fingerprint
export const generateDeviceKey = async (): Promise<CryptoKey> => {
  const fingerprint = await getDeviceFingerprint();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(fingerprint),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('KeyedIn-Salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};
