const jwt = require("jsonwebtoken");
const { encryptToken, decryptToken } = require("./crypto");
const ApiError = require("./customError");

const signJwt = (json, expiresIn = "1h") => {
  const jwtToken = jwt.sign(json, process.env.JWT_SECRET, {
    expiresIn,
  });
  const encryptedToken = encryptToken(jwtToken);
  return encryptedToken;
};

const verifyJwt = (encryptedToken) => {
  try {
    const decryptedToken = decryptToken(encryptedToken);

    const decodedValue = jwt.verify(decryptedToken, process.env.JWT_SECRET);
    return decodedValue;
  } catch (err) {
    throw new ApiError(
      401,
      "Invalid or expired token",
      "The token has expired or has been tampered."
    );
  }
};

module.exports = { signJwt, verifyJwt };
