const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Comment muse belong to a product"],
    },
    content: {
      type: String,
      require: [true, "A comment must have a content."],
      maxlength: [255, "Cannot exceed 255 characters"],
    },
    dateAdded: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.pre(/^find/, async function (next) {
  this.populate("user", "username");
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;