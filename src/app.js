const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const openApiDoc = require("../docs/openapi.json");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

//TODO: different routes here.

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

module.exports = app;
