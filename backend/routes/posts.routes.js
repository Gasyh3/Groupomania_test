const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const multer = require("../middlewares/multer.middleware");
const postsController = require("../controllers/posts.controller");

router.get("/", auth.auth, postsController.getAllPosts);
router.post("/add", auth.auth, multer, postsController.createPost);
router.get("/:id", auth.auth, postsController.getOnePost);
router.put("/:id", auth.auth, multer, postsController.updatePost);
router.delete("/:id", auth.auth, multer, postsController.deletePost);
router.post("/:id/like", auth.auth, postsController.likePost);
router.post("/:id/comments", auth.auth, postsController.addComment);
router.delete("/comments/:id", auth.auth, postsController.deleteComment);

module.exports = router;
