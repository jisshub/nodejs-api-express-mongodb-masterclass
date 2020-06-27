const asyncHandler = require("../middleware/async");
const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

// @desc - get all users
// @route - GET /api/v1/auth/users
// @access - Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    if (!users) {
        return next(new ErrorResponse('no users found', 404))
    }
    res.status(200).json({
        success: true,
        count: users.length,
        data: users
    });
});

// @desc GET A SINGLE USER
// @route GET /api/v1/auth/users/:id
// @access - Private
exports.getSingleUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        return next(new ErrorResponse(`no user found with id ${req.params.id}`, 404))
    };
    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc - CREATE A USER
// @route - POST /api/v1/auth/users
// @access - Private
exports.createUser = asyncHandler(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
});


// @desc - Update A USER
// @route - PUT /api/v1/auth/users/:id
// @access - Private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!user) {
        return next(new ErrorResponse(`no user found with id ${req.params.id}`, 404))
    };
    res.status(200).json({
        success: true,
        data: user
    });
})


// @desc - DELETE A USER
// @route - DELETE /api/v1/auth/users/:id
// @access - Private
exports.removeUser = asyncHandler(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id, (err) => {
        console.log(err);
    });
    res.status(200).json({
        success: true,
        msg: "data deleted",
        data: {}
    });
});