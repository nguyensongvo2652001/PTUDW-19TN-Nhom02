const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const productRouter = require("./productRouter");

const router = express.Router();

//TEST FRONTEND SINGUP, LOGIN

router.get("/signup", (req, res) => {
  res.render("./partials/signupForm", { layout: "./authentication" });
});

router.get("/login", (req, res) => {
  res.render("./partials/loginForm", { layout: "./authentication" });
});

//END TEST FRONTEND SINGUP, LOGIN

router.post("/login", authController.login);
router.post("/signUp", authController.signUp);

router
  .route("/me")
  .patch(
    //chưa làm patch
    authController.protect,
    userController.uploadAvatar,
    userController.resizeAndStoreAvatar,
    userController.updateMe
  )
  .get(
    //lam rồi
    authController.protect,
    userController.setCurrentUserId,
    userController.getUser
  );

router.route("/:id").get(userController.getUser);

router.use("/me/products", productRouter);
router.use("/:sellerId/products", productRouter);

module.exports = router;
