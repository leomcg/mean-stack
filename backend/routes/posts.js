const express = require("express");

const PostsController = require("../controllers/posts");

const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post("", checkAuth, extractFile, PostsController.savePost);

router.put("/:id", checkAuth, extractFile, PostsController.editPost);

router.get("", PostsController.fetchPosts);

router.get("/user/:creator", PostsController.getPostsByUser);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
