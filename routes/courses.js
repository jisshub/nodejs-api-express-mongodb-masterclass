const express = require('express');

// set mergeParams to true
const router = express.Router({
  mergeParams: true
});
// create routes

const {
  protect,
  authorize
} = require("../middleware/auth")

const {
  getCourses,
  getSingleCourse,
  createCourse,
  updateACourse,
  deleteACourse,
} = require('../controllers/courses');

// set routes
router.route('/').get(getCourses).post(protect, authorize('pulisher', 'admin'), createCourse);

//
router
  .route('/:id')
  .get(getSingleCourse)
  .put(protect, authorize('publisher', 'admin'), updateACourse)
  .delete(protect, authorize('publisher', 'admin'), deleteACourse);

// export the router
module.exports = router;

// // re-route to other routers