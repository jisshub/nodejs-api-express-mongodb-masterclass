const ErrorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  // copy err and its properties to error variable
  let error = {
    ...err
  };

  // assign error message to error.message
  error.message = err.message;

  console.log(err);

  // if the id is not correct format/not found a resource with that id
  if (err.name === 'CastError') {
    // set an error message
    const message = `Resource not found`;
    // instantiate errorRespose object
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate field error- check using error code.
  // console.log(err.code);
  if (err.code === 11000) {
    const message = `Resource with name ${err.keyValue.name} already exist`;
    error = new ErrorResponse(message, 400);
  }

  // mongoose validation error - get err.name
  // console.log(err.name);
  if (err.name === 'ValidationError') {
    // get each error values
    const message = Object.values(err.errors);

    error = new ErrorResponse(message, 400);
  }

  // finally return the response -> client wuth statucode.
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
}

// export the erroHandler
module.exports = errorHandler;