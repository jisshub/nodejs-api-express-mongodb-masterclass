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

    // create token for current user - invoke getSignedJwtToken method on current user.
    const token = user.getSignedJwtToken();

    // send back the repsonse -> client
    res.status(200).json({
        success: true,
        token: token
    });
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
    const user = user.findOne({
        email
    }).select('+password');

    // if no user exist,
    if (!user) {
        return next(new ErrorResponse("invalid credential given", 401));
    };

    // check if password matches - pass password as argument - use await, since v use await before bcrypt.compare()
    const isMatch = await user.matchPasswords(password);

    // if password not match
    if (!isMatch) {
        return next(new ErrorResponse('invalid cedentials', 401))
    };

    // if matches, create token and send success repsonse to client

    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    })


});