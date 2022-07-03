const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have a name"],
    maxlength: [150, "Product name is too long. Please try a shorter one."],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Product must have a price"],
    min: [0, "Must be a non negative value"],
  },
  shortDescription: {
    type: String,
    required: [true, "Product must have a short description"],
    trim: true,
    max: [255, "Cannot be more than 255 characters."],
  },
  longDescription: {
    type: String,
    trim: true,
    required: [true, "Product must have a long description"],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Product must belong to a seller"],
  },
  thumbnail: {
    type: String,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    required: [true, "Product must belong to a category"],
  },
  forSale: {
    type: Boolean,
    default: true,
  },
});

// QUERY MIDDLEWARES
//Populate seller field for product
productSchema.pre(/^find/, async function (next) {
  this.populate("seller", "username storeName");
  next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
