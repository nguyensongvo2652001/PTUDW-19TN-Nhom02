const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const productRouter = require("./productRouter");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signUp", authController.signUp);

router.patch(
  "/me",
  authController.protect,
  userController.uploadAvatar,
  userController.resizeAndStoreAvatar,
  userController.updateMe
);

router.use("/:sellerId/products", productRouter);
router.use("/me/products", productRouter);

module.exports = router;
