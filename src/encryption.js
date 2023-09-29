const config = require("./config.js");
const crypto = require("crypto");

const { secret_key, secret_iv, ecnryption_method } = config;

if (!secret_key || !secret_iv || !ecnryption_method) {
  throw new Error("secretKey, secretIV, and ecnryptionMethod are required");
}

const algorithm = "aes-256-cbc";
function encrypt(text, key, iv) {
  // Deriva la clave y el IV desde las cadenas UTF-8
  const derivedKey = Buffer.from(key, "utf8");
  const derivedIv = Buffer.from(iv, "utf8");
  let encrypted = "";

  key = crypto.scryptSync(text, key, 32);

  // Crea una instancia del cifrador AES-CTR con PKCS7
  const cipher = crypto.createCipheriv(algorithm, derivedKey, derivedIv);

  // Cifra el texto en formato utf-8
  encrypted = cipher.update(text, "utf8", "base64");
  cipher.setAutoPadding(true); // Habilita PKCS7
  let base64Value = cipher.final("base64");

  return base64Value;
}

function decrypt(encryptedText, key, iv) {
  // Deriva la clave y el IV desde las cadenas UTF-8
  const derivedKey = Buffer.from(key, "utf8");
  const derivedIv = Buffer.from(iv, "utf8");

  key = crypto.scryptSync(encryptedText, key, 32);
  const decipher = crypto.createDecipheriv(algorithm, derivedKey, derivedIv);
  let decrypted = decipher.update(encryptedText, "base64", "utf8");
  decipher.setAutoPadding(true); // Habilita PKCS7

  decrypted += decipher.final("utf8");
  return decrypted;
}

// Encrypt data
function encryptData(data) {
  const encryptedTextBase64 = encrypt(data, secret_key, secret_iv);
  return encryptedTextBase64;
}

// Decrypt data
function decryptData(encryptedData) {
  return decrypt(encryptedData, secret_key, secret_iv);
}

module.exports = { decryptData, encryptData };
