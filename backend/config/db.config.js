const mysql = require("mysql2");
require("dotenv").config({ path: "./.env" });

const pool = mysql.createPool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: "groupomania_db",
  password: process.env.PASS,
});

module.exports = pool.promise(console.log("Connexion à la base de données"));
