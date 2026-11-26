function base64ToBytes(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function importKey() {
  const raw = process.env.NEXT_PUBLIC_PAYLOAD_ENCRYPTION_KEY;
  if (!raw) {
    throw new Error("Missing client decryption key");
  }

  const keyBytes = base64ToBytes(raw);
  if (keyBytes.length !== 32) {
    throw new Error("Invalid client decryption key length");
  }

  return crypto.subtle.importKey("raw", keyBytes, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);
}

/** Decrypt AES-GCM payload from /api/vehicledetails */
export async function decryptClientPayload(envelope) {
  if (!envelope?.enc || !envelope?.payload || !envelope?.iv || !envelope?.tag) {
    throw new Error("Invalid encrypted response");
  }

  const key = await importKey();
  const iv = base64ToBytes(envelope.iv);
  const tag = base64ToBytes(envelope.tag);
  const data = base64ToBytes(envelope.payload);

  // Web Crypto expects ciphertext || authTag concatenated for AES-GCM
  const combined = new Uint8Array(data.length + tag.length);
  combined.set(data, 0);
  combined.set(tag, data.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    combined
  );

  const text = new TextDecoder().decode(decrypted);
  return JSON.parse(text);
}
