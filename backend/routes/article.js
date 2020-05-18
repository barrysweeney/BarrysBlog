const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");

const article_controller = require("../controllers/articleController");
const comments_controller = require("../controllers/commentController");

// Blog poster specific routes

// GET request for all articles, published and unpublished
router.get("/all", verify, article_controller.article_all);

// PUT request to publish/unpublish article
router.put("/:id/publish", verify, article_controller.article_publish);

// PUT request to edit article
router.put("/:id/edit", verify, article_controller.article_edit);

// POST request for creating an article
router.post("/new", verify, article_controller.article_create_post);

// DELETE request to delete an article
router.delete("/:id/delete", verify, article_controller.article_delete);

// Blog reader specific routes

// GET home page - display list of all published articles
router.get("/", article_controller.index);

// GET request for all comments of one article
router.get("/:id/comments", comments_controller.article_comments);

// POST request for creating a comment
router.post("/:id/comments/new", comments_controller.comment_create_post);

module.exports = router;
