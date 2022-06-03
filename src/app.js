const express = require("express");
const cookieParser = require("cookie-parser");

const errorController = require("./controllers/errorController");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const AppError = require("./utils/appError");

const app = express();

app.use(express.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }));
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.all("*", async (req, res, next) => {
  return next(new AppError("Can not find the specified url", 404));
});
app.use(errorController);

module.exports = app;
