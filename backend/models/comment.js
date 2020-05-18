const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  timestamp: { type: Date, default: Date.now() },
  message: { type: String, required: true },
  author: { type: String, required: true },
  article: { type: Schema.Types.ObjectId, ref: "Article", required: true },
});

// Virtual for comment's URL
CommentSchema.virtual("url").get(function () {
  return "/comment/" + this._id;
});

//Export model
module.exports = mongoose.model("Comment", CommentSchema);
