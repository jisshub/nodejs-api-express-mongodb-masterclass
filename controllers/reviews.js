const asyncHandler = require('../middleware/async');
const advancedResult = require('../middleware/advancedResults');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

// @desc - GET All Reviews
// @route - GET /api/v1/reviews,
// @route - GET /api/v1/bootcamps/:bootcampId/reviews
// @access - Public
exports.getReviews = asyncHandler(async (req, res, next) => {
    let query;
    // check if params have bootcampId,
    if (req.params.bootcampId) {
        // get reviews of that specific bootcamp
        query = Review.find({
            bootcamp: req.params.bootcampId,
        });
    } else {
        // get all reviews if no params
        query = Review.find().populate('bootcamp', 'name description');
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

// @desc - GET a single review
// @route - GET /api/v1/reviews/:id
// @access - Private
exports.getSingleReview = asyncHandler(async (req, res, next) => {
    // get review and polulate the result with bootcamp name, description
    const review = await Review.findById(req.params.id).populate(
        'bootcamp',
        'name description'
    );
    if (!review) {
        return next(new ErrorResponse(`no review found with id ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: review,
    });
});