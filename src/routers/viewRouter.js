const express = require("express");

const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");

const router = express.Router();

router.use(viewController.isLogin);

router.get(
  "/cart",
  viewController.redirectIfNotLogin,
  viewController.cartViewController
);

module.exports = router;
