const User = require("../models/userModel");
const Product = require("../models/productModel");
const catchAsync = require("../utils/catchAsync");

const search = catchAsync(async (req, res, next) => {
  const query = req.query.q || "";
  const regexPartialQueryObject = { $regex: query, $options: "i" };

  const users = await User.find({
    $or: [
      { username: regexPartialQueryObject },
      { phoneNumber: regexPartialQueryObject },
      { storeName: regexPartialQueryObject },
      { description: regexPartialQueryObject },
    ],
  });

  const products = await Product.find({
    $or: [
      { name: regexPartialQueryObject },
      { shortDescription: regexPartialQueryObject },
      { longDescription: regexPartialQueryObject },
      { "seller.username": regexPartialQueryObject },
      { "seller.storeName": regexPartialQueryObject },
      { category: regexPartialQueryObject },
    ],
  });

  res.status(200).json({
    status: "success",
    usersLength: users.length,
    productsLength: products.length,
    data: {
      users,
      products,
    },
  });
});

module.exports = { search };
