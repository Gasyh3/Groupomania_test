const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");

const db = require("./models");

const userRoutes = require("./routes/users.routes");
const postsRoutes = require("./routes/posts.routes");

app.use(express.json());
app.use(cors());
app.use(helmet()); // helmet

app.use("./upload", express.static(path.join(__dirname, "./upload")));
app.use("/users", userRoutes);
app.use("/posts", postsRoutes);

module.exports = app;
