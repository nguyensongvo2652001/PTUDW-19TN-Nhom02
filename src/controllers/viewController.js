const { promisify } = require("util");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");

const isLogin = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next();

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await User.findById(decoded.id).select("+passwordChangedAt");

  if (!user) return next();

  const changedPasswordAfter = user.changedPasswordAfter(
    user.passwordChangedAt,
    decoded.iat
  );

  if (changedPasswordAfter) return next();

  req.user = user;
  res.locals.user = user;
  next();
});

const redirectIfNotLogin = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  return next();
};

const redirectIfLogin = (req, res, next) => {
  if (req.user) return res.redirect("/");
  return next();
};

module.exports = {
  isLogin,
  redirectIfLogin,
  redirectIfNotLogin,
};
