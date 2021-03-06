const asyncHandler = require('../middleware/async');
const Courses = require('../models/Courses');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');

// @desc - get all courses, get course spcific to a bootcamp
// @access - public
// @route - GET /api/v1/courses
// @route - GET /api/v1/bootcamps/:bootcampId/courses

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  // check whether there is bootcampId as req.params/not.
  if (req.params.bootcampId) {
    // if yes get courses that matches bootcampId
    query = Courses.find({
      bootcamp: req.params.bootcampId,
    });
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
  // add current user to the req.body.user
  req.body.user = req.user.id;

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

  // if current user is not bootcamp owner and his role is not admin,
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} is not authorized to add a course to the bootcamp ${bootcamp._id}`
      ),
      401
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

// @PUT - update a course
// @route - PUT /api/v1/course/:id
// @access - Private

exports.updateACourse = asyncHandler(async (req, res, next) => {
  // find course by id
  let course = await Courses.findById(req.params.id);
  // if no course exist
  if (!course) {
    return next(
      new ErrorResponse(`course with id ${req.params.id} no found`),
      404
    );
  }

  // if course owner is not the one trying to update and not an admin
  if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user ${req.user.id} not authorized to update the course ${course._id}`
      )
    );
  }

  // if user -> course owner and admin, update the course
  course = await Courses.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // send bakc the response
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc - delete a course
// @route - PUT /api/v1/courses/:id
// @access- private

exports.deleteACourse = asyncHandler(async (req, res, next) => {
  // find the course
  let course = await Courses.findById(req.params.id);

  // if cousre found
  if (course) {
    // check sure user is the owner  of the course and also an admin.
    if (course.user.toString() === req.user.id && req.user.role === 'admin') {
      course = await Courses.findOneAndDelete(req.params.id);
      // send back the resposne to clienT
      res.status(200).json({
        success: true,
        msg: 'data deleted',
      });
    } else {
      // if not the course onwer and admin
      return next(new ErrorResponse(`user ${req.user.id} notauthorized to delete the course ${course._id}`));
    }
  }
  // if course not found,
  return next(new ErrorResponse(`course not found with id ${req.params.id}`));
});