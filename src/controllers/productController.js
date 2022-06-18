const multer = require("multer");
const sharp = require("sharp");

const Product = require("../models/productModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const { filterObject } = require("../utils/helpers");

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const fileType = file.mimetype.split("/")[0];
  const { fieldname } = file;
  if (fileType !== "image")
    return cb(
      new AppError(
        `
        ${fieldname} must be an image. Please try another file`,
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
      thumbnail: `product_${product._id}_thumbnail.jpg`,
    },
    { new: true }
  );

  //Store the thumbnail into database
  await sharp(buffer)
    .resize(500, 500)
    .jpeg({ quality: 80 })
    .toFile(
      public / images / products / thumbnails / `${updatedProduct.thumbnail}`
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
  if (!thumbnail) {
    // If there is no thumbnail then we also need to delete the product (all product MUST have a thumbnail)
    await Product.findByIdAndDelete(product._id);
    return next(new AppError("A product must have a thumbnail", 400));
  }

  product = await resizeAndStoreThumbnail(product, thumbnail.buffer);

  res.status(201).json({
    status: "success",
    data: { product },
  });
});

const setProductFilterObject = catchAsync(async (req, res, next) => {
  // This middleware is used to get products from a specific seller based on the id parameter in the url only, NOT all products like default.

  // Only search for products that are still for sale
  req.productsFilter = { forSale: { $ne: false } };

  if (req.params.sellerId) {
    //Check if the user with the specified id exists
    const user = await User.findById(req.params.sellerId);
    if (!user)
      return next(new AppError("No users found with specified id", 404));

    req.productsFilter.seller = req.params.sellerId;
  }
  next();
});

const verifyIfProductForSale = catchAsync(async (req, res, next) => {
  // We use this middleware to check whether a product is still for sale or not.
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new AppError("No products found with specified id", 404));

  if (!product.forSale)
    return next(new AppError("This product is no longer for sale", 400));

  next();
});

const verifyProductSeller = catchAsync(async (req, res, next) => {
  //We use this middleware to check whether the user who is trying to perform the action is the seller of the product.
  const product = await Product.findById(req.params.id);

  if (!product)
    return next(new AppError("No products found with specified id", 404));

  if (req.user._id.equals(product.seller._id)) return next();
  return next(new AppError("You are not allowed to perform this action", 401));
});

const removeProduct = catchAsync(async (req, res, next) => {
  //We do not really remove the product just update the forSale field to false (this will make it easier for querying orders)

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { forSale: false },
    { new: true }
  );

  if (!product)
    return next(new AppError("No products found with specified id", 404));

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const updateProduct = catchAsync(async (req, res, next) => {
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

  let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!product)
    return next(new AppError("No products found with specified id", 404));

  // Update thumbnail if necessary
  const thumbnail = req.file;
  if (thumbnail)
    product = await resizeAndStoreThumbnail(product, thumbnail.buffer);

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

const getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.find(req.productsFilter).lean(),
    req.query
  )
    .filter()
    .sort();

  const products = await features.queryObj;
  const data = {
    header: "header",
    content: "homePage",
    footer: "footer",
    products: products,
  };
  console.log(products);
  res.render("partials/authenticatedHomePage", data);
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     length: products.length,
  //     products,
  //   },
  // });
});

const getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).lean();

  if (!product)
    return next(new AppError("No products found with the specified id", 404));

  const data = {
    header: "header",
    content: "detailItem",
    footer: "footer",
    product: product,
  };
  res.render("partials/authenticatedDetailItem", data);
  // console.log(product);
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     product,
  //   },
  // });
});

module.exports = {
  uploadThumbnail,
  resizeAndStoreThumbnail,
  addProduct,
  getAllProducts,
  getProduct,
  setProductFilterObject,
  verifyProductSeller,
  verifyIfProductForSale,
  removeProduct,
  updateProduct,
};
