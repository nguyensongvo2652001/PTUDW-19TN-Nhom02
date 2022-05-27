const multer = require("multer");
const sharp = require("sharp");

const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { filterObject } = require("../utils/helpers");

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
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
}

const upload = multer({ storage, fileFilter });
const uploadThumbnail = upload.single("thumbnail");
const resizeAndStoreThumbnail = catchAsync(async (req, res, next) => {
  //   if (!req.files) return next();
  //   const { avatar } = req.files;
  //   if (!avatar) return next();
  //   req.body.avatar = `user_${req.user.id}_avatar.jpg`;
  //   await sharp(avatar[0].buffer)
  //     .resize(500, 500)
  //     .jpeg({ quality: 80 })
  //     .toFile(`public/img/users/avatars/${req.body.avatar}`);
  console.log(req.files);

  // next();
});

const addProduct = catchAsync(async (req, res, next) => {
  req.body = filterObject(req.body, {
    whiteList: [
      "name",
      "price",
      "shortDescription",
      "longDescription",
      "thumbnail",
      "category",
    ],
  });

  req.body.seller = req.user._id;

  const product = await Product.create(req.body);

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

module.exports = { uploadThumbnail, resizeAndStoreThumbnail, addProduct };
