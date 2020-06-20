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
const courseRouter = require('./courses');
const advancedResult = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// re-route to other routers
router.use('/:bootcampId/courses', courseRouter);

// set routers for get and post with no params
// use advancedResult middleware to getBootcamps.
// pass Model, Populate as arguments
router.route('/').get(advancedResult(Bootcamp, "courses"), getBootcamps).post(createBootcamp);

// set a seperate routers for put, delete, get with params id.
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// route for bootcamp photo uplaod
router.route('/:id/photo').put(bootcampPhotoUpload);
// export the router here
module.exports = router;