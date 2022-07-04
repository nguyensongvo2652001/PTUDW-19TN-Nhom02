const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createErrorPage = require("../utils/errorFactory")

const { filterObject } = require("../utils/helpers");

const getComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ product: req.params.id }).lean();

  if (comments != null) {
    req.comments = comments;
  }
  next();
});

const postComment = catchAsync(async (req, res, next) => {
  if (req.user == null) {
    createErrorPage(req,res,"No user found, please login to perform this function!",400)
    return next(
      new AppError("No user found, please login to perform this function!", 400)
    );
  }
  req.body = filterObject(req.body, {
    whiteList: ["content"],
  });
  req.body.user = req.user.id;
  req.body.product = req.params.id;
  console.log(
    req.body.content + "\t" + req.body.user + "\t" + req.body.product
  );

  const comment = await Comment.create(req.body);
  console.log(comment);
  res.redirect("back");
});

module.exports = {
  getComments,
  postComment,
};