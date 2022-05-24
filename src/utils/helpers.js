const jwt = require("jsonwebtoken");

const filterObject = (object, { whiteList }) => {
  const newObject = {};
  Object.keys(object).forEach((key) => {
    if (!whiteList.includes(key)) return;
    newObject[key] = object[key];
  });

  return newObject;
};

const createJsonWebToken = async (user) => {
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

module.exports = { filterObject, createJsonWebToken };
