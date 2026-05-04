/**
 * AES-256-GCM enkripcija za .p12 certifikate.
 * ENCRYPTION_KEY = process.env.FISCAL_ENCRYPTION_KEY (32 bajta, hex encoded).
 * Decrypt se izvodi SAMO u memoriji — plaintext se nikad ne zapisuje.
 */

import crypto from 'crypto';

function getEncryptionKey(): Buffer {
  const key = process.env.FISCAL_ENCRYPTION_KEY;
  if (!key) {
    throw new Error('FISCAL_ENCRYPTION_KEY nije postavljen.');
  }
  const buf = Buffer.from(key, 'hex');
  if (buf.length !== 32) {
    throw new Error('FISCAL_ENCRYPTION_KEY mora biti 32 bajta (64 hex znaka).');
  }
  return buf;
}

export function encryptCertificate(p12Buffer: Buffer): {
  encrypted: string;
  iv: string;
  salt: string;
} {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const salt = crypto.randomBytes(32);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(p12Buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  const combined = Buffer.concat([encrypted, authTag]);
  return {
    encrypted: combined.toString('base64'),
    iv: iv.toString('hex'),
    salt: salt.toString('hex'),
  };
}

export function decryptCertificate(encrypted: string, iv: string, salt: string): Buffer {
  void salt;
  const key = getEncryptionKey();
  const combined = Buffer.from(encrypted, 'base64');
  const authTag = combined.subarray(combined.length - 16);
  const data = combined.subarray(0, combined.length - 16);
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex'),
  );
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

/**
 * Enkriptira kratki string (lozinku) istim ključem kao certifikat.
 * Vraća base64 string s IV-om na početku (16 bajta) + authTag (16 bajta).
 */
export function encryptPassword(password: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(password, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return Buffer.concat([iv, authTag, encrypted]).toString('base64');
}

/**
 * Dekriptira lozinku enkriptiranu s encryptPassword.
 */
export function decryptPassword(encryptedPassword: string): string {
  const key = getEncryptionKey();
  const combined = Buffer.from(encryptedPassword, 'base64');
  const iv = combined.subarray(0, 16);
  const authTag = combined.subarray(16, 32);
  const data = combined.subarray(32);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8');
}
