const asyncHandler = require("../middleware/async");


// @desc - controller for registeration
// @routes - POST /api/v1/auth/registet
// @access - Public
exports.register = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true
    });
});