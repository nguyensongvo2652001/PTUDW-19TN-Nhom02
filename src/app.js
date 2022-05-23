const express = require("express");

const app = express();

app.use(express.json({ limit: process.env.MAX_REQUEST_BODY_SIZE }));

module.exports = app;
