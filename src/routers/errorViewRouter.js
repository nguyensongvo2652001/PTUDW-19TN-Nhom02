const express = require("express");
const router = express.Router();
const errorViewRender = require("../controllers/errorController");

router.route("/").get(errorViewRender.renderErrorPage)

module.exports = router