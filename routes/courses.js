const express = require('express');

// set mergeParams to true
const router = express.Router({ mergeParams: true });
// create routes

const {
  getCourses,
  getSingleCourse,
  createCourse,
} = require('../controllers/courses');

// set routes
router.route('/').get(getCourses).post(createCourse);

//
router.route('/:id').get(getSingleCourse);

// export the router
module.exports = router;

// // re-route to other routers
