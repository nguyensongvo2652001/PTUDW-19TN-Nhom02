const express = require("express");

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router
  .route("/checkout")
  .post(authController.protect, orderController.createOrder)
  .get(authController.protect, orderController.getCart);

router
  .route("/history")
  .get(authController.protect, orderController.getOrdersHistory);

module.exports = router;
