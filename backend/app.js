const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
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

app.use("/api/user", userRoutes);

const dbTest = async function () {
  try {
    await sequelize.authentificate();
    console.log("La connexion a été établie avec succès.");
  } catch (error) {
    console.error("Impossible de se connecté à la base de données:", error);
  }
};

module.exports = app;
