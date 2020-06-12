function errorHandler(err, req, res, next) {
  // send response to client
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'server error',
  });
}

// export the erroHandler
module.exports = errorHandler;
