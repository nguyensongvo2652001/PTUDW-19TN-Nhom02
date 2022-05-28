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
const resizeAndStoreThumbnail = async (product, buffer) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    product._id,
    {
      thumbnail: `product_${product._id}_thumbnail`,
    },
    { new: true }
  );

  //Store the thumbnail into database
  await sharp(buffer)
    .resize(500, 500)
    .jpeg({ quality: 80 })
    .toFile(
      `public/images/products/thumbnails/${updatedProduct.thumbnail}.jpg`
    );

  return updatedProduct;
};

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

  // Create product WITHOUT thumbnail
  let product = await Product.create(req.body);

  // Store thumbnail in database and update the thumbnail field of product
  const thumbnail = req.file;
  if (!thumbnail)
    return next(new AppError("A product must have a thumbnail", 400));

  product = await resizeAndStoreThumbnail(product, thumbnail.buffer);

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

const setProductFilterObject = (req, res, next) => {
  if (req.params.sellerId) req.productsFilter = { seller: req.params.sellerId };
  next();
};

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find(req.productsFilter).sort("-dateAdded");

  res.status(200).json({
    status: "success",
    data: {
      length: products.length,
      products,
    },
  });
});

const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(new AppError("No products found with the specified id", 404));

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

module.exports = {
  uploadThumbnail,
  resizeAndStoreThumbnail,
  addProduct,
  getAllProducts,
  getProduct,
};
