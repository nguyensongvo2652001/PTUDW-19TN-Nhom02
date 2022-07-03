const { Order, Checkout, OrderedProduct } = require("../models/orderModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");

const clearOrders = async (order, checkout, orderedProducts) => {
  await Order.findByIdAndDelete(order._id);
  await Checkout.findByIdAndDelete(checkout._id);
  await Promise.all(
    orderedProducts.map(
      async (orderedProduct) =>
        await OrderedProduct.findByIdAndDelete(orderedProduct._id)
    )
  );
};

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
    orderedProducts.map(async (orderedProduct) => {
      const newOrderedProduct = await OrderedProduct.findById(
        orderedProduct._id
      );
      newOrderedProduct.totalPrice = newOrderedProduct.calculateTotalPrice();
      await newOrderedProduct.save();
      return newOrderedProduct;
    })
  );

  const notForSaleOrderedProducts = orderedProducts.filter(
    (orderedProduct) => !orderedProduct.product.forSale
  );

  if (notForSaleOrderedProducts.length > 0) {
    await clearOrders(order, checkout, orderedProducts);
    return next(
      new AppError(
        "Some of the products you chose are not for sale. Please remove them",
        400
      )
    );
  }

  order.totalPrice = await order.calculateTotalPrice();
  await order.save();

  if (order.totalPrice > req.user.account) {
    await clearOrders(order, checkout, orderedProducts);
    return next(
      new AppError("You don't have enough money to make this order", 400)
    );
  }

  req.user.account -= order.totalPrice;
  await req.user.save();

  res.redirect("/api/v1/orders");
});

const getOrdersHistory = catchAsync(async (req, res, next) => {
  if (!req.query.sort) req.query.sort = "-dateOrdered";
  const features = new APIFeatures(
    OrderedProduct.find({ buyer: req.user._id }),
    req.query
  )
    .filter()
    .sort();
  const products = await features.queryObj;
  console.log(products);
  const data = {
    name: "Your orders",
    header: "header",
    content: "order",
    display: "orderHistory",
    footer: "footer",
    products: products,
  };
  res.render("layouts/main", data);
});

const getCart = (req, res, next) => {
  const data = {
    name: "Shopping cart",
    header: "header",
    content: "order",
    display: "cartHistory",
    footer: "footer",
  };
  res.render("layouts/main", data);
};

module.exports = { createOrder, getOrdersHistory, getCart };
