const express = require('express');

// set mergeParams to true
const router = express.Router({ mergeParams: true });
// create routes

const { getCourses } = require('../controllers/courses');

// set routes
router.route('/').get(getCourses);

// export the router
module.exports = router;
