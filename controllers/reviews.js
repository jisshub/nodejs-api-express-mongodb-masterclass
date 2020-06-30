const asyncHandler = require('../middleware/async');
const advancedResult = require('../middleware/advancedResults');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

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
        return next(
            new ErrorResponse(`no review found with id ${req.params.id}`, 404)
        );
    }
    res.status(200).json({
        success: true,
        data: review,
    });
});

// @desc- create review
// @route - POST /api/v1/bootcamps/:bootcampId/reviews
// @access - Private
exports.createReview = asyncHandler(async (req, res, next) => {
    // assign bootcampId to bootcamp in body,
    req.body.bootcamp = req.params.bootcampId;
    // assign current user id to body.user
    req.body.user = req.user.id;

    // find the bootcamp by bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId);

    // check bootcamp exist/not
    if (!bootcamp) {
        return new ErrorResponse(
            `bootcamp with id ${req.params.bootcampId} not found`,
            404
        );
    }

    // if user role is not 'user'
    if (req.user.role !== 'user') {
        return next(
            new ErrorResponse(
                `user role ${req.user.role} is not authorized to add a review for bootcamp ${bootcamp._id}`,
                401
            )
        );
    }

    // get review written by current user
    let review = await Review.findOne({
        user: req.user.id,
    });

    // a user can give one review for a bootcamp - if a review added by current user,
    if (review) {
        return next(
            new ErrorResponse(
                `user ${req.user.id} cant post multiple reviews for bootcamp`,
                400
            )
        );
    }

    // if no review added by the current user then add new review
    review = await Review.create(req.body);

    // send resposne
    res.status(201).json({
        success: true,
        review,
    });
});

// @desc - update reviews
// @route - PUT /api/v1/reviews/:id
// @access - Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)
    if (!review) {
        return next(new ErrorResponse(`review with id ${req.params.id} not found`, 404));
    }
    review = await Review.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: review
    })
});