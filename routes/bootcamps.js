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
} = require('../controllers/bootcamps');

//
const courseRouter = require('./courses');

// re-route to other routers
router.use('/:bootcampId/courses', courseRouter);

// set routers for get and post with no params
router.route('/').get(getBootcamps).post(createBootcamp);

// set a seperate routers for put, delete, get with params id.
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// export the router here
module.exports = router;
