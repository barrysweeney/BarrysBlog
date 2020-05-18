const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  timestamp: { type: Date, default: Date.now() },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  published: { type: Boolean, default: false },
});

// Virtual for article's URL
ArticleSchema.virtual("url").get(function () {
  return "/article/" + this._id;
});

//Export model
module.exports = mongoose.model("Article", ArticleSchema);
