const express = require("express");

const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

const router = express.Router();

router
  .route("/checkout")
  .post(authController.protect, orderController.createOrder)
  .get(authController.protect, orderController.getOrdersHistory);

// ///////////TEST CART AND CHECKOUT PAGE//////////////
// router.get("/cart", (req, res) => {
//   const data = {
//     header: "header",
//     content: "cart",
//     footer: "footer",
//   };
//   req.data = res.render("layouts/main", data);
// });

// router.post("/checkout", authController.protect, (req, res) => {
//   console.log(req.body);
//   const data = {
//     header: "header",
//     content: "checkoutForm",
//     footer: "footer",
//   };
//   res.render("layouts/main", data);
// });
// ///////////////////////////////////////////

module.exports = router;
