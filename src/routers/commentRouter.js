const express = require("express");

const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/:id")
  .get(authController.checkUser, commentController.getComments)
  .post(authController.protect, commentController.postComment);

module.exports = router;
