const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { filterObject } = require("../utils/helpers");
const createErrorPage = require("../utils/errorFactory");

const setCurrentUserId = (req, res, next) => {
  //Use this middleware for route with "/me/..."

  req.params.sellerId = req.params.id = req.user._id; //This is useful when we want to get all the products from the current user

  next();
};
const storage = multer.memoryStorage();
const fileFilter = function (req, file, cb) {
  const fileType = file.mimetype.split("/")[0];
  const { fieldname } = file;
  if (fileType !== "image") {
    createErrorPage(
      req,
      res,
      "file must be an image. Please try another file",
      400
    );
    return cb(
      new AppError(
        `${fieldname} must be an image. Please try another file`,
        400
      ),
      false
    );
  }

  cb(null, true);
};
const upload = multer({ storage, fileFilter });

const uploadAvatar = upload.single("avatar");

const resizeAndStoreAvatar = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const avatar = req.file.buffer;
  if (!avatar) return next();
  req.body.avatar = `user_${req.user.id}_avatar.jpg`;
  await sharp(avatar)
    .resize(500, 500)
    .jpeg({ quality: 80 })
    .toFile(`public/images/users/avatars/${req.body.avatar}`);

  next();
});

const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).lean();

  if (!user) {
    createErrorPage(req, res, "Can not find the user with specified id", 404);
    return next(new AppError("Can not find the user with specified id", 404));
  }
  const hasLoggedIn = req.user != null;
  const data = {
    header: "header",
    footer: "footer",
    content: "profilePage",
    user: user,
    editButton: hasLoggedIn,
    asideProfile: hasLoggedIn,
  };
  res.render("layouts/main", data);
});

const updateMe = catchAsync(async (req, res, next) => {
  req.body = filterObject(req.body, {
    whiteList: [
      "username",
      "storeName",
      "phoneNumber",
      "avatar",
      "description",
    ],
  });
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

const updateAccount = catchAsync(async (req, res, next) => {
  const userInput = filterObject(req.body, {
    whiteList: ["account"],
  });
  const user = await User.findById(req.user._id).lean();
  oldAccount = user.account || 0;
  newAccount = Number(oldAccount) + Number(userInput.account);
  result = Number(newAccount);
  const filter = { _id: req.user._id };
  const update = { account: result };
  let userUpdated = await User.findOneAndUpdate(filter, update);
});

const bufferAccount = catchAsync(async (req, res, next) => {
  const amount = req.params.amount;
  const user = await User.findById(req.user._id).lean();
  console.log(user);
  let userUpdated = await User.findOneAndUpdate(
    { _id: user._id },
    { $inc: { account: amount } }
  );
  res.redirect("/api/v1/products");
});

module.exports = {
  setCurrentUserId,
  uploadAvatar,
  resizeAndStoreAvatar,
  updateMe,
  getUser,
  bufferAccount,
  updateAccount,
};
