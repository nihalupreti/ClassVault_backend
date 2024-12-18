const crypto = require("crypto");

const encryptToken = (token) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    Buffer.from(process.env.ENCRYPTION_KEY.slice(0, 16))
  );
  let encrypted = cipher.update(token, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

const decryptToken = (encryptedToken) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY),
    Buffer.from(process.env.ENCRYPTION_KEY.slice(0, 16))
  );
  let decrypted = decipher.update(encryptedToken, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
};

module.exports = { encryptToken, decryptToken };
