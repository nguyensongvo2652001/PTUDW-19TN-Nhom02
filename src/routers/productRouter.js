const express = require("express");

const productController = require("../controllers/productController");
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    authController.checkUser,
    productController.setProductFilterObject,
    productController.getAllProducts
  )
  .post(
    authController.protect,
    productController.uploadThumbnail,
    productController.addProduct
  );

router
  .route("/:id")
  .get(
    authController.checkUser,
    commentController.getComments,
    productController.setProductFilterObject,
    productController.getProduct
  )
  .delete(
    authController.protect,
    productController.verifyIfProductForSale,
    productController.verifyProductSeller,
    productController.removeProduct
  )
  .patch(
    authController.protect,
    productController.verifyIfProductForSale,
    productController.verifyProductSeller,
    productController.uploadThumbnail,
    productController.updateProduct
  );

module.exports = router;
