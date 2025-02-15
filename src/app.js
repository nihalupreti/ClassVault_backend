const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const openApiDoc = require("../docs/openapi.json");
const swaggerUi = require("swagger-ui-express");
const errorHandler = require("./middlewares/error");
const userRoutes = require("./routes/userAuthRoute");
const teacherRoutes = require("./routes/teacherRoute");
const groupRoutes = require("./routes/groupRoutes");
const discussionRoutes = require("./routes/discussionRoutes");
const fileRoutes = require("./routes/fileRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const assignmentRoutes = require("./routes/assignmentRoute");

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? "https://class-vault-frontend.vercel.app" // Deployed environment
    : "http://localhost:5173"; // Development environment
const app = express();
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(
  helmet({
    contentSecurityPolicy: false, // TODO: just for development properly configure it later
    frameguard: false,
  })
);
app.use(express.json());
app.use(cookieParser());

//Different routes here.
app.use("/api/user", userRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/assignment", assignmentRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/discussion", discussionRoutes);
app.use("/api", fileRoutes);
app.use("/api/course", resourceRoutes);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDoc));

app.use(errorHandler);

module.exports = app;
