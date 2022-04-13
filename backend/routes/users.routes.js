const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const multer = require("../middlewares/multer.middleware");
const usersController = require("../controllers/users.controller");

router.post("/signup", auth.checkUsername, auth.valid, usersController.signup);
router.post("/login", auth.valid, usersController.login);
router.get("/accounts", auth.auth, usersController.getAllUsers);
router.put("/accounts/:id", auth.auth, multer, usersController.updateAccount);
router.get("/accounts/:id", auth.auth, usersController.getAccount);
router.delete("/accounts/:id", auth.auth, usersController.deleteAccount);

module.exports = router;
