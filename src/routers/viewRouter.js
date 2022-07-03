const express = require("express");

const authController = require("../controllers/authController");
const viewController = require("../controllers/viewController");

const router = express.Router();

router.use(viewController.isLogin, viewController.redirectIfNotLogin);

module.exports = router;
