const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// protect the routes with token
exports.protect = asyncHandler(async (req, res, next) => {
  //initialze token
  let token;
  // check authorization header is given and its value starts with 'Bearer' - access headers with 'req.headers'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // split req.headers.authorization into an array and get the token from it.
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token
  }

  // if token not exists
  if (!token) {
    return next(new ErrorResponse('not authorized to access the route', 401));
  }

  // verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // decoded = { id: '5ef0594deb5f495dbceacfca', iat: 1592903813, exp: 1595495813 }

    // decoded has an id - use it to find the current user.
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('not authorzed tp access the route', 401));
  }
});

// grant access to the specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // check if current user role is included in roles array recieved,

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `not authorized to access the route by role ${req.user.role}`,
          403
        )
      );
      // 403 - client not have access to the requested resource
    }
    next();
  };
};