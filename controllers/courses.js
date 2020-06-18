const asyncHandler = require('../middleware/async');
const Courses = require('../models/Courses');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

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

// @ desc - get single course
// @route - GET /api/v1/courses/:id
exports.getSingleCourse = asyncHandler(async (req, res, next) => {
  const course = await Courses.findById(req.params.id).populate(
    'bootcamp',
    'name description'
  );

  if (!course) {
    return next(
      new ErrorResponse(`Course with id ${req.params.id} not found`, 400)
    );
  }

  // end back the response to client
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @ desc - add new course
// @route - POST /api/v1/bootcamps/:bootcampId/courses
// @access -Private

exports.createCourse = asyncHandler(async (req, res, next) => {
  // assign bootcamp id in params to bootcamp field in course
  req.body.bootcamp = req.params.bootcampId;

  // find the bootcamp by bootcampId
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  // check bootcamp exist/not
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `bootcamp not found with id ${req.params.bootcampId}`,
        404
      )
    );
  }
  // if bootcamp exist -> create course -> pass body which also ncludes req.body.bootcamp field

  const courses = await Courses.create(req.body);

  // send back response to client
  res.status(200).json({
    data: courses,
    success: true,
  });
});

// delete a course
// exports.deleteACourse =
