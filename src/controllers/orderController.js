const { Order, Checkout, OrderedProduct } = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createOrder = catchAsync(async (req, res, next) => {
  let orderData = req.body.order;
  let checkoutData = req.body.checkout;
  let productsData = req.body.products;

  orderData.buyer = req.user._id;

  const order = await Order.create(orderData);

  checkoutData.order = order._id;
  const checkout = await Checkout.create(checkoutData);

  productsData = productsData.map((productData) => {
    return { ...productData, order: order._id, buyer: req.user._id };
  });

  let orderedProducts = await Promise.all(
    productsData.map(
      async (productData) => await OrderedProduct.create(productData)
    )
  );

  orderedProducts = await Promise.all(
    orderedProducts.map(
      async (orderedProduct) =>
        await OrderedProduct.findById(orderedProduct._id)
    )
  );

  order.totalPrice = await order.calculateTotalPrice();
  await order.save();

  if (order.totalPrice > req.user.account) {
    await Order.findByIdAndDelete(order._id);
    await Checkout.findByIdAndDelete(checkout._id);
    await Promise.all(
      orderedProducts.map(
        async (orderedProduct) =>
          await OrderedProduct.findByIdAndDelete(orderedProduct._id)
      )
    );
    return next(
      new AppError("You don't have enough money to make this order", 400)
    );
  }

  req.user.account -= order.totalPrice;
  await req.user.save();

  res.status(201).json({
    status: "success",
    data: {
      order,
      checkout,
      orderedProducts,
    },
  });
});

module.exports = { createOrder };
