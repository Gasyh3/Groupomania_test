const token = require("../middlewares/token.middleware");
const { Posts } = require("../models");
const { Likes } = require("../models");
const { Comments } = require("../models");
const { Users } = require("../models");
const fs = require("fs");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll({
      attributes: ["id", "postText", "title", "imageUrl", "createdAt"],
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["username", "id", "profilePicture"],
        },
        {
          model: Likes,
          attributes: ["UserId"],
        },
        {
          model: Comments,
          attributes: ["commentBody", "username", "UserId", "id"],
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Users,
              attributes: ["profilePicture", "username"],
            },
          ],
        },
      ],
    });
    res.status(200).send(posts);
  } catch (error) {
    return res.status(500).send({
      error: "Une erreur est survenu lors de la récupération des posts ",
    });
  }
};

exports.getOnePost = async (req, res) => {
  try {
    const post = await Posts.findOne({
      // on récupère le post avec l'id fourni en incluant les tables et attributs nécessaires
      where: { id: req.params.id },
      include: [
        {
          model: Users,
          attributes: ["username", "profilePicture", "id"],
        },
        {
          model: Likes,
          attributes: ["PostId", "UserId"],
        },
        {
          model: Comments,
          order: [["createdAt", "DESC"]],
          attributes: ["commentBody", "username", "UserId"],
          include: [
            {
              model: Users,
              attributes: ["profilePicture", "username"],
            },
          ],
        },
      ],
    });
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.createPost = async (req, res) => {
  const userId = token.getUserId(req);
  let imageUrl;
  try {
    const user = await Users.findOne({
      attributes: ["username", "id", "profilePicture"],
      where: { id: userId },
    });
    if (user !== null) {
      if (req.file) {
        imageUrl = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
      } else {
        imageUrl = null;
      }
      const post = await Posts.create({
        include: [
          {
            model: Users,
            attributes: ["username", "profilePicture", "id"],
          },
        ],
        message: req.body.postText,
        title: req.body.title,
        imageUrl: imageUrl,
        UserId: user.id,
      });

      res
        .status(201)
        .json({ post: post, messageRetour: "Votre post est ajouté" });
    } else {
      res.status(400).send({ error: "Erreur " });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = token.getUserId(req);
    const checkAdmin = await Users.findOne({ where: { id: userId } });
    const post = await Posts.findOne({ where: { id: req.params.id } });
    if (userId === post.UserId || checkAdmin.admin === true) {
      if (post.imageUrl) {
        const filename = post.imageUrl.split("/upload")[1];
        fs.unlink(`upload/${filename}`, () => {
          Posts.destroy({ where: { id: post.id } });
          res.status(200).json({ message: "Post supprimé" });
        });
      } else {
        Posts.destroy({ where: { id: post.id } }, { truncate: true });
        res.status(200).json({ message: "Post supprimé" });
      }
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.updatePost = async (req, res) => {
  try {
    let newImageUrl;
    const userId = token.getUserId(req);
    let post = await Posts.findOne({ where: { id: req.params.id } });
    if (userId === post.UserId) {
      if (req.file) {
        newImageUrl = `${req.protocol}://${req.get("host")}/api/upload/${
          req.file.filename
        }`;
        if (post.imageUrl) {
          const filename = post.imageUrl.split("/upload")[1];
          fs.unlink(`upload/${filename}`, (err) => {
            if (err) console.log(err);
            else {
              console.log(`Deleted file: upload/${filename}`);
            }
          });
        }
      }
      if (req.body.postText) {
        post.message = req.body.postText;
      }
      post.title = req.body.title;
      post.imageUrl = newImageUrl;
      const newPost = await post.save({
        fields: ["postText", "title", "imageUrl"],
      });
      res.status(200).json({ newPost: newPost, messageRetour: "post modifié" });
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.likePost = async (req, res, next) => {
  try {
    const userId = token.getUserId(req);
    const postId = req.params.id;
    const user = await Likes.findOne({
      where: { UserId: userId, PostId: postId },
    });
    if (user) {
      await Likes.destroy(
        { where: { UserId: userId, PostId: postId } },
        { truncate: true, restartIdentity: true }
      );
      res.status(200).send({ messageRetour: "vou n'aimez plus ce post" });
    } else {
      await Likes.create({
        UserId: userId,
        PostId: postId,
      });
      res.status(201).json({ messageRetour: "vous aimez ce post" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.addComment = async (req, res) => {
  try {
    const comment = req.body.commentBody;
    const username = req.body.username;
    const newComment = await Comments.create({
      commentBody: comment,
      username: username,
      UserId: token.getUserId(req),
      PostId: req.params.id,
    });

    res
      .status(201)
      .json({ newComment, messageRetour: "votre commentaire est publié" });
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const userId = token.getUserId(req);
    const checkAdmin = await Users.findOne({ where: { id: userId } });
    const comment = await Comments.findOne({ where: { id: req.params.id } });

    if (userId === comment.UserId || checkAdmin.admin === true) {
      Comments.destroy({ where: { id: req.params.id } }, { truncate: true });
      res.status(200).json({ message: "commentaire supprimé" });
    } else {
      res.status(400).json({ message: "Vous n'avez pas les droits requis" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Erreur serveur" });
  }
};
