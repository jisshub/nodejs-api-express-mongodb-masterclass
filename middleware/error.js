const ErrorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  // copy err and its properties to error variable
  let error = { ...err };

  // assign error message to error.message
  error.message = err.message;

  console.log(err);

  // if the id is not correct format/not found a resource with that id
  if (err.name === 'CastError') {
    // set an error message
    const message = `Resource with id ${err.value} is not found`;

    // instantiate errorRespose object
    error = new ErrorResponse(message, 404);
  }
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
}

// export the erroHandler
module.exports = errorHandler;
