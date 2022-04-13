const bcrypt = require("bcrypt");
const { Users } = require("../models");
const fs = require("fs");
const { validateToken } = require("../middlewares/auth.middleware");
const token = require("../middlewares/token.middleware");
const { Op } = require("sequelize");

exports.signup = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (user != null) {
      if (user.username === req.body.username) {
        return res
          .status(400)
          .json({ error: "This username is already in use" });
      }
    } else {
      const hash = await bcrypt.hash(req.body.password, 10);
      const newUser = await Users.create({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        admin: false,
      });

      const tokenObject = await token.issueJWT(newUser);
      res.status(201).send({
        user: newUser,
        token: tokenObject.token,
        expires: tokenObject.expiresIn,
        message: `Le compte ${newUser.username} a bien été créé`,
      });
    }
  } catch (error) {
    return res.status(400).send({ error: "email déjà utilisé" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (user === null) {
      return res.status(403).send({ error: "Connexion échouée" });
    } else {
      const hash = await bcrypt.compare(req.body.password, user.password);
      if (!hash) {
        return res.status(401).send({ error: "Mot de passe incorrect !" });
      } else {
        const tokenObject = await token.issueJWT(user);
        res.status(200).send({
          user: user,
          token: tokenObject.token,
          sub: tokenObject.sub,
          expires: tokenObject.expiresIn,
          message: "Bonjour" + user.username + " !",
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.getAccount = async (req, res) => {
  // on trouve l'utilisateur et on renvoie l'objet user
  try {
    const user = await Users.findOne({
      where: { id: req.params.id },
    });
    res.status(200).send(user);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.getAllUsers = async (req, res) => {
  // on envoie tous les users sauf admin
  try {
    const users = await Users.findAll({
      attributes: ["username", "id", "profilePicture", "bio", "email"],
      where: {
        id: {
          [Op.ne]: 1,
        },
      },
    });
    res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.updateAccount = async (req, res) => {
  // modifier le profil
  const id = req.params.id;
  try {
    const userId = token.getUserId(req);
    let newPhoto;
    let user = await Users.findOne({ where: { id: id } }); // on trouve le user
    if (userId === user.id) {
      if (req.file && user.profilePicture) {
        newPhoto = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
        const filename = user.profilePicture.split("/upload")[1];
        fs.unlink(`upload/${filename}`, (err) => {
          // s'il y avait déjà une photo on la supprime
          if (err) console.log(err);
          else {
            console.log(`Deleted file: upload/${filename}`);
          }
        });
      } else if (req.file) {
        newPhoto = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
      }
      if (newPhoto) {
        user.profilePicture = newPhoto;
      }
      if (req.body.bio) {
        user.bio = req.body.bio;
      }
      if (req.body.pseudo) {
        user.username = req.body.username;
      }
      const newUser = await user.save({
        fields: ["username", "bio", "profilePicture"],
      }); // on sauvegarde les changements dans la bdd
      res.status(200).json({
        user: newUser,
        messageRetour: "Votre profil a bien été modifié",
      });
    } else {
      res
        .status(400)
        .json({ messageRetour: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await Users.findOne({ where: { id: id } });
    if (user.profilePicture !== null) {
      const filename = user.profilePicture.split("/upload")[1];
      fs.unlink(`upload/${filename}`, () => {
        // sil' y a une photo on la supprime et on supprime le compte
        Users.destroy({ where: { id: id } });
        res.status(200).json({ messageRetour: "utilisateur supprimé" });
      });
    } else {
      Users.destroy({ where: { id: id } }); // on supprime le compte
      res.status(200).json({ messageRetour: "utilisateur supprimé" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};
