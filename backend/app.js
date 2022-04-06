const express = require("express");
const db = require("./config/db.config");
const app = express();
const path = require("path");
const helmet = require("helmet");

app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

/**
 * * Régler les problèmes de CORS
 */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
