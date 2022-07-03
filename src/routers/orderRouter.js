const express = require("express");

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, orderController.createOrder)
  .get(authController.protect, orderController.getOrdersHistory);

///////////TEST CART AND CHECKOUT PAGE//////////////
router.get("/cart", (req, res) => {
  const data = {
    header: "header",
    content: "cart",
    footer: "footer",
  };
  res.render("layouts/main", data);
});

router.get("/checkout", (req, res) => {
  const data = {
    header: "header",
    content: "checkoutForm",
    footer: "footer",
  };
  res.render("layouts/main", data);
});
///////////////////////////////////////////

module.exports = router;
