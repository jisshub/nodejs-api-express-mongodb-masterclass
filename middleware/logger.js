// define a middleware
const logger = (req, res, next) => {
  // get the full url
  console.log(
    `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  next();
};

// export the middle ware
module.exports = logger;
