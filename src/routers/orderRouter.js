const express = require("express");

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router.route("/").post(authController.protect, orderController.createOrder);

module.exports = router;
