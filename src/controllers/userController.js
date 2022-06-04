const multer = require("multer");
const sharp = require("sharp");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { filterObject } = require("../utils/helpers");

const setCurrentUserId = (req, res, next) => {
  //Use this middleware for route with "/me/..."

  req.params.sellerId = req.user._id; //This is useful when we want to get all the products from the current user
  next();
};
const storage = multer.memoryStorage();
const fileFilter = function (req, file, cb) {
  const fileType = file.mimetype.split("/")[0];
  const { fieldname } = file;
  if (fileType !== "image")
    return cb(
      new AppError(
        `${fieldname} must be an image. Please try another file`,
        400
      ),
      false
    );
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

const updateMe = catchAsync(async (req, res, next) => {
  req.body = filterObject(req.body, {
    whiteList: ["username", "storeName", "phoneNumber", "avatar"],
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

module.exports = {
  setCurrentUserId,
  uploadAvatar,
  resizeAndStoreAvatar,
  updateMe,
};
