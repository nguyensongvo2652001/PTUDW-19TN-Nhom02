const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must specify your name"],
    maxlength: [50, "Your name is too long"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "You must specify your phone number"],
    maxlength: [20, "Your phone number is too long"],
    trim: true,
  },
  province: {
    type: String,
    required: [true, "You must specify your province"],
    maxlength: [100, "Your province name is too long"],
    trim: true,
  },
  district: {
    type: String,
    required: [true, "You must specify your district"],
    maxlength: [100, "Your district name is too long"],
    trim: true,
  },
  ward: {
    type: String,
    required: [true, "You must specify your ward"],
    maxlength: [100, "Your ward name is too long"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "You must specify your address"],
    maxlength: [300, "Your address is too long"],
    trim: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Checkout must belong to an order"],
  },
});

const orderedProductSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order item must belong to an order"],
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Order item must be one of the product"],
  },
  count: {
    type: Number,
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Number of products bought must be larger than 0",
    },
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Order item must belong to a buyer"],
  },
});

/*QUERY MIDDLEWARE */
//Populate product field
orderedProductSchema.pre(/^find/, async function (next) {
  this.populate("product", "name price seller thumbnail dateAdded");
  next();
});

const orderSchema = new mongoose.Schema(
  {
    dateOrdered: {
      type: String,
      default: Date.now,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Order must belong to an user"],
    },
    transportPrice: {
      type: Number,
      default: 0,
    },
    surcharge: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*INSTANCE METHODS */
//Calculate total price
orderSchema.methods.calculateTotalPrice = async function () {
  const orderedProducts = await OrderedProduct.find({ order: this._id });
  const productsPrice = orderedProducts.reduce(
    (acc, orderedProduct) =>
      acc + orderedProduct.product.price * orderedProduct.count,
    0
  );
  return this.transportPrice + this.surcharge + productsPrice;
};

/*************************************/

orderSchema.virtual("checkout", {
  ref: "Checkout",
  localField: "_id",
  foreignField: "order",
});

orderSchema.virtual("orderItems", {
  ref: "OrderItem",
  localField: "_id",
  foreignField: "order",
});

const Order = mongoose.model("Order", orderSchema);
const OrderedProduct = mongoose.model("OrderedProduct", orderedProductSchema);
const Checkout = mongoose.model("Checkout", checkoutSchema);

module.exports = { Order, OrderedProduct, Checkout };
