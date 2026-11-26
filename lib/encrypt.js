import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

function getKeyBuffer() {
  const raw =
    process.env.PAYLOAD_ENCRYPTION_KEY ||
    process.env.NEXT_PUBLIC_PAYLOAD_ENCRYPTION_KEY;

  if (!raw) {
    throw new Error("PAYLOAD_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) {
    throw new Error("PAYLOAD_ENCRYPTION_KEY must be 32 bytes (base64-encoded)");
  }
  return key;
}

/** Encrypt JSON-serializable data → opaque Network-tab payload */
export function encryptPayload(data) {
  const key = getKeyBuffer();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);

  const plaintext = Buffer.from(JSON.stringify(data), "utf8");
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    enc: true,
    v: 1,
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    payload: ciphertext.toString("base64"),
  };
}

export function decryptPayload({ iv, tag, payload }) {
  const key = getKeyBuffer();
  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(tag, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload, "base64")),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8"));
}
