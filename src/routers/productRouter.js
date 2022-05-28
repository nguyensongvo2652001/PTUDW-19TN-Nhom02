const express = require("express");

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    productController.uploadThumbnail,
    productController.addProduct
  );

router.route("/:id").get(productController.getProduct);

module.exports = router;
