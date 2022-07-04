const AppError = require("../utils/appError");
const createErrorPage = require("../utils/errorFactory")


const handleErrorDebug = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    isOperational: err.isOperational || false,
    error: err,
  });
};

const handleErrorProd = (err, req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

const handleDuplicateFieldError = (err) => {
  const duplicatedFields = Object.keys(err.keyPattern);
  const message = `Duplicated fields: ${duplicatedFields.join(
    ", "
  )}. Please try another value for these fields`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const { errors } = err;
  const errorsMessages = Object.values(errors).map((val) => val.message);
  const message = errorsMessages.join("; ");
  return new AppError(message, 400);
};

const handleInvalidObjectIdError = (err) => {
  return new AppError("Invalid id, please try another one", 400);
};

const errorController = (err, req, res, next) => {
  //In case the error is not operational
  let error = { ...err };
  console.log(err);
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";
  error.name = err.name;

  if (error.code === 11000)
  {
    createErrorPage(req,res,"Duplicate fields. Please try another value for these fields",400)
    error = handleDuplicateFieldError(error);
  }  
  if (error.name === "ValidationError")
  {
    createErrorPage(req,res,"Validation Error",400)
    error = handleValidationError(error);
  }  
  if (error.kind === "ObjectId")
  {
    createErrorPage(req,res,"Invalid id, please try another one",400)
    error = handleInvalidObjectIdError(error);
  }

  if (process.env.MODE === "DEBUG") handleErrorDebug(error, req, res);
  if (process.env.MODE === "PROD") handleErrorProd(error, req, res);
};


const renderErrorPage = (req, res) => {
  const data = {
    header: "header",
    content: "errorPage",
    message: req.session.error, 
    errorNumber: req.session.errorNumber,
    footer: "footer",
  };
  res.render("layouts/main", data);
  req.session.destroy();
}

module.exports = { errorController, renderErrorPage };
