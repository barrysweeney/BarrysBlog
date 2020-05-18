const Article = require("../models/article");
const async = require("async");
const mongoose = require("mongoose");

// list of all published articles or all articles if logged in
exports.index = function (req, res) {
  Article.find({ published: true })
    .populate("author")
    .exec(function (err, articles_list) {
      if (err) {
        return next(err);
      }
      res.json(articles_list);
    });
};

// list of all articles
exports.article_all = function (req, res) {
  Article.find({})
    .populate("author")
    .exec(function (err, articles_list) {
      if (err) {
        return next(err);
      }
      res.json(articles_list);
    });
};

// handle article create on POST
exports.article_create_post = function (req, res, next) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
    author: req.user._id,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.sendStatus(200);
  });
};

// handle article delete on DELETE
exports.article_delete = function (req, res) {
  async.parallel(
    {
      article: function (callback) {
        Article.findById(req.params._id).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      Article.findByIdAndRemove(req.params.id, (err, doc) => {
        if (err) return next(err);
        if (!doc) return res.sendStatus(404);
        return res.sendStatus(204);
      });
    }
  );
};

// handle article publish/unpublish on PUT
exports.article_publish = function (req, res) {
  Article.findByIdAndUpdate(
    req.params.id,
    { published: req.body.publish },
    function (err, doc) {
      if (err) return next(err);
      if (!doc) return res.sendStatus(404);
      return res.sendStatus(200);
    }
  );
};

// handle article edit on PUT
exports.article_edit = function (req, res) {
  Article.findByIdAndUpdate(
    req.params.id,
    { title: req.body.title, content: req.body.content },
    function (err, doc) {
      if (err) return next(err);
      if (!doc) return res.sendStatus(404);
      return res.sendStatus(200);
    }
  );
};
