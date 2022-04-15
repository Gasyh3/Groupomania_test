const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();

const db = require("./models");

const userRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");
const { requireAuth } = require("./middlewares/auth.middleware");

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use("./upload", express.static(path.join(__dirname, "./upload")));
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

module.exports = app;
