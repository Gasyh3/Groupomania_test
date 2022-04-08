const mysql = require("mysql2");
require("dotenv").config({ path: "./.env" });

const pool = mysql.createPool({
  multipleStatements: true,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB,
  password: process.env.DB_PASS,
});

module.exports = pool.promise(console.log("Connexion à la base de données"));
