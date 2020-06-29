const asyncHandler = require("../middleware/async");
const advancedResult = require("../middleware/advancedResults");
const Review = require("../models/Review");

// @desc - GET All Reviews
// @route - GET /api/v1/reviews,
// @route - GET /api/v1/bootcamps/:bootcampId/reviews
// @access - Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    let query;
    // check if params have bootcampId,
    if (req.params.bootcampId) {
        // get reviews of that specific bootcamp
        query = await Review.find({
            bootcamp: req.params.bootcampId
        });
    } else {
        // get all reviews if no params
        query = await Review.find().populate('bootcamp', 'name description');
    }
    // exceute the query
    const reviews = await query;
    // send back response
    res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
    });
});