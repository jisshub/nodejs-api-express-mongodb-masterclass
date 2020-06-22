const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require('../utils/errorResponse');


// @desc - user registeration
// @routes - POST /api/v1/auth/registet
// @access - Public
exports.register = asyncHandler(async (req, res, next) => {
    // pull the data  from req.body,
    const {
        name,
        email,
        password,
        role
    } = req.body

    // create user - pass fields as object
    const user = await User.create({
        name,
        email,
        password,
        role
    })

    // invoke sendTokenResponse()- pass args
    sendTokenResponse(user, 200, res)
});

// @desc - user login
// @route - POST /api/v1/auth/login
// access - Public

exports.login = asyncHandler(async (req, res, next) => {
    // get email, passpwrd from input
    const {
        email,
        password
    } = req.body;

    // validate email, password
    if (!email || !password) {
        return next(new ErrorResponse("no email and password", 400));
    }

    // if inputs given, check user exist in db/not by matching email with email in db, select password to validate
    const user = await User.findOne({
        email
    }).select('+password');

    // if no user exist,
    if (!user) {
        return next(new ErrorResponse("invalid credentials", 401));
    };

    // check if password matches - pass password as argument - use await, since v use await before bcrypt.compare()
    const isMatch = await user.matchPasswords(password);

    // if password not match
    if (!isMatch) {
        return next(new ErrorResponse('invalid cedentials', 401))
    };

    // invoke sendTokenResponse()- pass args
    sendTokenResponse(user, 200, res);
});

// get token, create cookie and send token with in cookie as respone
const sendTokenResponse = (user, statusCode, res) => {
    // if matches, create token and send success repsonse to client
    const token = user.getSignedJwtToken();

    // set options for the cookie
    const options = {
        // cookie expires in current date + 30 days.
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),

        // cookie accessible oly thru client side script, set httpOnly to true
        httpOnly: true
    };

    // if production mode, set secure flag to true,
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
        // if true, cookie will sent with https protocol,
    }

    // send back the response with cookie having token in it.
    res
        .status(statusCode)
        .cookie('cookie-1', token, options)
        .json({
            success: true,
            token: token
        });
}