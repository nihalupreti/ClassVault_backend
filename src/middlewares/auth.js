const ApiError = require("../utils/customError");
const { verifyJwt } = require("../utils/jwt");
const Student = require("../models/StudentUser");
const Teacher = require("../models/TeacherUser");


const verifyToken = async (req, res, next) => {
  try {

    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;
    if (decoded.role === "teacher") {
      user = await Teacher.findById(decoded._id);
    } else if (decoded.role === "student") {
      user = await Student.findById(decoded._id);
    }

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;
    next();
  }
  catch (err) {
    res.status(401).send({ error: "Please authenticate." });
  }
};



// const verifyToken = (req, res, next) => {
//   const encryptedToken = req.cookies.authToken;
//   if (!encryptedToken) {
//     throw new ApiError(401, "Access denied.", "Token was not provided");
//   }
//   const decodedToken = verifyJwt(encryptedToken);
//   req.user = decodedToken;
//   next();
// };

module.exports = verifyToken;
