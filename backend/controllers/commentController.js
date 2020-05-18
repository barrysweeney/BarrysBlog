const validator = require("express-validator");
const Article = require("../models/article");
const Comment = require("../models/comment");
const async = require("async");

// GET all comments for an article
exports.article_comments = function (req, res) {
  Comment.find({ article: req.params.id }).exec(function (err, comment_list) {
    if (err) {
      return next(err);
    }
    res.json(comment_list);
  });
};

// handle comment create on POST
exports.comment_create_post = [
  validator.body("message").trim(),
  validator.body("username").trim(),
  validator.sanitizeBody("*").escape(),
  (req, res, next) => {
    Article.findById(req.params.id, (err, doc) => {
      if (err) {
        return next(err);
      }
      const comment = new Comment({
        message: req.body.message,
        author: req.body.username,
        article: doc.id,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect(req.get("referer"));
      });
    });
  },
];
