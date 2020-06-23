const express = require('express');

// set mergeParams to true
const router = express.Router({
  mergeParams: true
});
// create routes

const {
  protect
} = require("../middleware/auth")

const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateACourse,
  deleteACourse,
} = require('../controllers/courses');

// set routes
router.route('/').get(getCourses).post(protect, createCourse);

//
router
  .route('/:id')
  .get(protect, getSingleCourse)
  .put(protect, updateACourse)
  .delete(protect, deleteACourse);

// export the router
module.exports = router;

// // re-route to other routers