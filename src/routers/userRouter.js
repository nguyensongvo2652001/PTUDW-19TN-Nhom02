const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const productRouter = require("./productRouter");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signUp", authController.signUp);

router
  .route("/me")
  .patch(
    authController.protect,
    userController.uploadAvatar,
    userController.resizeAndStoreAvatar,
    userController.updateMe
  )
  .get(
    authController.protect,
    userController.setCurrentUserId,
    userController.getUser
  );

router.route("/:id").get(userController.getUser);

router.use("/me/products", productRouter);
router.use("/:sellerId/products", productRouter);

module.exports = router;
