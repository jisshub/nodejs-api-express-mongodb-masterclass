const asyncHandler = require("../middleware/async");
const User = require("../models/User");


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

    res.status(200).json({
        success: true,
        data: user
    });
});