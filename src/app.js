const express = require("express");

const errorController = require("./controllers/errorController");

const app = express();

app.use(express.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }));

app.use(errorController);

module.exports = app;
