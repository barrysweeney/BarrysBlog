const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/articles");
});

// POST request for logging in
router.post("/log-in", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user)
    return res.status(400).send("Username and/or password is incorrect");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.sendStatus(400);

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  res.header("auth-token", token).send(token);
  res.redirect(req.get("referer"));
});

// GET request for logging out
router.get("/log-out", (req, res) => {
  req.logout();
  res.redirect(req.get("referer"));
});

module.exports = router;
