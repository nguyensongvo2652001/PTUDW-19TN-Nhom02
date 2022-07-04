const express = require("express");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const expressHBS = require("express-handlebars");
const session = require("express-session")

const errorController = require("./controllers/errorController");
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const commentRouter = require("./routers/commentRouter");
const orderRouter = require("./routers/orderRouter");
const searchRouter = require("./routers/searchRouter");

const errorViewRouter = require("./routers/errorViewRouter");

const AppError = require("./utils/appError");

const createErrorPage = require("./utils/errorFactory")

const path = require("path");
const { redirect } = require("./controllers/authController");
const app = express();

// Handlebars
const hbs = expressHBS.create({
  layoutsDir: path.join(__dirname, "/views/layouts"),
  partialsDir: path.join(__dirname, "./views/partials"),
  defaultLayout: "main",
  extname: "hbs",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
// End handlebars

app.use(express.json()); // for json
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true })); // for form data
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }));
app.use(cookieParser());

app.use(session({secret: 'keyboard cat', resave: true, saveUninitialized: true}))

app.use("/api/v1/search", searchRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/comments", commentRouter);

app.use("/api/v1/error", errorViewRouter)

// app.use("/", viewRouter);
app.all("*", async (req, res, next) => {
  createErrorPage(req,res,"Can not find the specified url!",404)
  return next(new AppError("Can not find the specified url!", 404));
});
app.use(errorController.errorController);

module.exports = app;
