const express = require("express");

const errorController = require("./controllers/errorController");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(express.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }));

app.use("/api/v1/users", userRouter);
app.use(errorController);

module.exports = app;
