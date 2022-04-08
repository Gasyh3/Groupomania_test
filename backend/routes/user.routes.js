const express = require("express");
const router = express.Router();
const userControl = require("../controllers/user.controller");
const multer = require("../middlewares/multerForUser.middleware");
const auth = require("../middlewares/auth.middleware");
const validator = require("../middlewares/validator.middleware");

module.exports = router;
