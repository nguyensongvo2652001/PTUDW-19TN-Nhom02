const setCurrentUserId = (req, res, next) => {
  //Use this middleware for route with "/me/..."

  req.params.sellerId = req.user._id; //This is useful when we want to get all the products from the current user
  next();
};

module.exports = { setCurrentUserId };
