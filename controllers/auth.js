const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmails');
const crypto = require('crypto');

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
    } = req.body;

    // create user - pass fields as object
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    // invoke sendTokenResponse()- pass args
    sendTokenResponse(user, 200, res);
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
        return next(new ErrorResponse('no email and password', 400));
    }

    // if inputs given, check user exist in db/not by matching email with email in db, select password to validate
    const user = await User.findOne({
        email,
    }).select('+password');

    // if no user exist,
    if (!user) {
        return next(new ErrorResponse('invalid credentials', 401));
    }

    // check if password matches - pass password as argument - use await, since v use await before bcrypt.compare()
    const isMatch = await user.matchPasswords(password);

    // if password not match
    if (!isMatch) {
        return next(new ErrorResponse('invalid cedentials', 401));
    }

    // invoke sendTokenResponse()- pass args
    sendTokenResponse(user, 200, res);
});

// @desc - get the current logged in user
// @route - GET /api/v1/auth/me
// access - Private

exports.getMe = asyncHandler(async (req, res, next) => {
    // get the user
    const user = await User.findById(req.user.id);
    // send back the response
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc - update user details
// @routes - PUT /api/v1/auth/updatedetails
// @access - Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
    // set field to update
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
    };

    // find the user and update - validate
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true,
    });

    //   return response
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc - UPDATE USER PASSSWORD
// @route - PUT /api/v1/auth/updatepassword
// @access - Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
    // find the user
    const user = await User.findById(req.user.id).select('+password');

    // check if current password in body matches with password in db, call matchPassword method in middleware
    if (!(await user.matchPasswords(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is Incorrect', 401));
    }
    // assign new password to user
    user.password = req.body.newPassword;
    // save 
    await user.save();
    // send token response if password is changed.
    sendTokenResponse(user, 200, res)
});

// @desc - FORGOT password- genrate token
// @route - GET /api/v1/auth/forgotpassword
// @access - Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    // find the user with email that matches the email in the body

    const user = await User.findOne({
        email: req.body.email,
    });

    // if no user
    if (!user) {
        return next(
            new ErrorResponse(`no user with email ${req.body.email} found`, 404)
        );
    }
    // resetToken constant gets token returned from
    // getResetPasswordToken() method in User model
    const resetToken = user.getResetPasswordToken();

    // save data to current user in db without validation,
    await user.save({
        validateBeforeSave: false,
    });

    // create reset url,
    const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;
    // Example: http://locahost:5000//api/resetpassword/tokenvalue

    // set the message
    const message = `you are requested for password reset. make a PUT request to ${resetUrl}`;

    try {
        // define options object
        await sendEmail({
            email: user.email,
            subject: 'password reset',
            message,
        });

        // send back the response
        res.status(200).json({
            success: true,
            data: 'Email Send',
        });
    } catch (err) {
        // if any error, reset the resetPasswordExpire and resetPassowrdToken fields
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // save to db - NO VALIDATION
        await user.save({
            validateBeforeSave: false,
        });

        // return an error response
        return next(new ErrorResponse(`Email not sent`, 500));
    }
});

// @desc- reset the password
// @route - PUT /api/v1/auth/resetpassword/:resettoken
// @access - Public

exports.passwordReset = asyncHandler(async (req, res, next) => {
    // first get the hashed token an store it to resetPasswordToken variable,
    const resetPasswordToken = await crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    // find user using resetPasswordToken and resetPasswordExpire
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now(),
        },
    });
    // if user found
    if (user) {
        // set new password
        user.password = req.body.password;
        // set resetPasswordToken and resetPasswordExpire to undefined
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        // finally save the user
        await user.save();

        // call sendTokenResponse
        sendTokenResponse(user, 200, res);
    } else {
        return next(new ErrorResponse('invalid token', 400));
    }
});

// get token, create cookie and send token with in cookie as respone
const sendTokenResponse = (user, statusCode, res) => {
    // if matches, create token and send success repsonse to client
    const token = user.getSignedJwtToken();

    // set options for the cookie
    const options = {
        // cookie expires in current date + 30 days.
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),

        // cookie accessible oly thru client side script, set httpOnly to true
        httpOnly: true,
    };

    // if production mode, set secure flag to true,
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
        // if true, cookie will sent with https protocol,
    }

    // send back the response with cookie having token in it.
    res.status(statusCode).cookie('cookie-1', token, options).json({
        success: true,
        token: token,
    });
};