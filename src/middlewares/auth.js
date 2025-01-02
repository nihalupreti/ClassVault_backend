const ApiError = require("../utils/customError");
const { verifyJwt } = require("../utils/jwt");

const verifyToken = (req, res, next) => {
  const encryptedToken = req.cookies.authToken;
  if (!encryptedToken) {
    throw new ApiError(401, "Access denied.", "Token was not provided");
  }
  const decodedToken = verifyJwt(encryptedToken);
  req.user = decodedToken;
  next();
};

module.exports = verifyToken;
