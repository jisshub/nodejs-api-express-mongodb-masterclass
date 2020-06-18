const asyncHandler = require('../middleware/async');
const Courses = require('../models/Courses');

// @desc - get all courses, get course spcific to a bootcamp
// @access - public
// @route - GET /api/v1/courses
// @route - GET /api/v1/bootcamps/    :bootcampId/courses

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  // check whether there is bootcampId as req.params/not.
  if (req.params.bootcampId) {
    // if yes get courses that matches bootcampId
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    // else, get all courses with bootcamp name & decsription, use populate()
    query = Courses.find().populate('bootcamp', 'name description');
  }

  // execute the query
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
