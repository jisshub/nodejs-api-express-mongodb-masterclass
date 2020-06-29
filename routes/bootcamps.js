const express = require('express');
// require express Router
const router = express.Router();

// require controller methods using destructuring
const {
  getBootcamps,
  getSingleBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');
// 
const {
  protect,
  authorize
} = require("../middleware/auth")

//
const courseRouter = require('./courses');
const reviewRouter = require("./reviews")

const advancedResult = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// re-route to course routers v have below api
router.use('/:bootcampId/courses', courseRouter);
// re-route to reviews router if v have below api
router.use("/:bootcampId/reviews", reviewRouter);

// set routers for get and post with no params
// use advancedResult middleware to getBootcamps.
// pass Model, Populate as arguments
router.route('/').get(advancedResult(Bootcamp, "courses"), getBootcamps).post(protect, authorize('publisher', 'admin'), createBootcamp);

// set a seperate routers for put, delete, get with params id.
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

// route for bootcamp photo uplaod
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
// export the router here
module.exports = router;