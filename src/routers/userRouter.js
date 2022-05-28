const express = require("express");

const authController = require("../controllers/authController");
const productRouter = require("./productRouter");

const router = express.Router();

router.post("/login", authController.login);
router.post("/signUp", authController.signUp);

router.use("/:sellerId/products", productRouter);
router.use("/me/products", productRouter);

module.exports = router;
