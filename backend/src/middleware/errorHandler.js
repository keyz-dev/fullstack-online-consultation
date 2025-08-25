const logger = require("../utils/logger");
const Joi = require("joi");
const Sequelize = require("sequelize");
const multer = require("multer");
const errorHandler = (err, req, res, next) => {
  if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
    err.message = err.errors[0].message;
  } else if (
    err.details &&
    Array.isArray(err.details) &&
    err.details.length > 0
  ) {
    err.message = err.details[0].message;
  }

  logger.error(err.message);

  if (err instanceof Joi.ValidationError) {
    // Handle Joi validation errors
    return res.status(400).json({
      status: false,
      message: "Validation error",
      error: err.message,
    });
  }

  // Custom middleware error handler
  if (err instanceof multer.MulterError) {
    message = null;
    if (err.code === "LIMIT_FILE_SIZE") {
      message = {
        msg: err.message.toLowerCase() + ", max file size is 8Mb",
        field: err.field,
      };
    }
    return res.status(400).json({
      status: false,
      error: "File Upload Error",
      message: message || err.message.toLowerCase(),
    });
  }

  // handle for sequelize
  if (err instanceof Sequelize.Error) {
    return res.status(400).json({
      status: false,
      error: "Sequelize Error",
      message: err.message,
    });
  }

  // Handle other types of errors (optional)
  return res.status(err.status || 500).json({
    status: false,
    error: "Unknown error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
