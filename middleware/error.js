function errorHandler(err, req, res, next) {
  // log the error
  console.log(err);
  // send resposne to client
  res.status(500).json({
    success: false,
    error: err.message,
  });
}

// export the erroHandler
module.exports = errorHandler;
