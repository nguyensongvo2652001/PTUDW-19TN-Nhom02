const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: [true, "Username must be unique"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (val) {
        //Password must be at least 10 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character
        return val.match(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{10,}$/
        );
      },
      message:
        "Your password is not strong enough. Password must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character",
    },
    select: false,
  },
  passwordChangedAt: {
    type: Date,
    select: false,
  },
  storeName: {
    type: String,
    maxlength: [50, "Your store name is too long"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    maxlength: [160, "Description is too long"],
  },
  avatar: {
    type: String,
    default: "default.jpg",
  },
  account: {
    type: Number,
    default: 0,
    select: false,
  },
});

//DOCUMENT MIDDLEWARES
/**********************************/
//Encrypt password before saving to database
userSchema.pre("save", async function (next) {
  if (!this.isNew && !this.isModified("password")) return next();
  try {
    console.log(this);
    this.password = await bcrypt.hash(this.password, 15);
    next();
  } catch (e) {
    throw new Error(e);
  }
});
/**********************************/

//INSTANCE METHODS
/**********************************/
userSchema.methods.verifyPassword = async (
  plainTextPassword,
  hashedPassword
) => {
  try {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (e) {
    throw new Error(e);
  }
};

userSchema.methods.changedPasswordAfter = function (passwordChangedAt, date) {
  if (!passwordChangedAt) return false;
  return passwordChangedAt.getTime() > date * 1000;
};
/**********************************/

const User = mongoose.model("User", userSchema);

module.exports = User;
