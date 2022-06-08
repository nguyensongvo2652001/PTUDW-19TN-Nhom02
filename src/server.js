const mongoose = require("mongoose");

//Handle uncaught exceptions error
process.on("uncaughtException", (err) => {
  console.error(err, "Uncaught Exception Caught");
  process.exit(1);
});

//Handle unhandled rejections
process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

// Configurate environment variables
const dotenv = require("dotenv");
dotenv.config({ path: "./env/config.env" });

const app = require("./app");

// Connect to database
let databaseString = process.env.DB_STRING.replace(
  /<username>/,
  process.env.DB_USERNAME
);
databaseString = databaseString.replace(/<password>/, process.env.DB_PASSWORD);
mongoose.connect(databaseString, () => {
  console.log("DATABASE CONNECTED");
});

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log("SERVER STARTED");
});
