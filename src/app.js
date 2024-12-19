const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const openApiDoc = require("../docs/openapi.json");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middlewares/error");
const userRoutes = require("./routes/userRoute");
const teacherRoutes = require("./routes/teacherRoute");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//Different routes here.
app.use("/api", userRoutes);
app.use("/api/teacher", teacherRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

app.use(errorHandler);

module.exports = app;
