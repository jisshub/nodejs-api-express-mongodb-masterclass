// require the models
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { query } = require('express');

// create controller method for each routes
// and export

// @desc - get all bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //make a copy of req.query
  const reqQuery = { ...req.query };

  // convert js object to json string.
  let queryStr = JSON.stringify(reqQuery);
  // gives,  {"averageCost":{"lte":"8000"}}

  // replace lte with $lte,
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // v concatenate with $ with matched value,

  // console.log(queryStr); // {"averageCost":{"$lte":"8000"}}

  // pass queryStr to query - parse it to js object - populate the courses in each bootcamp
  query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

  // executing the query
  const bootcamps = await query;
  // get query params from api
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc - get a bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps/:id

exports.getSingleBootcamp = asyncHandler(async (req, res, next) => {
  // use findById()
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if no bootcamp exist, even though id is in correct format
  if (!bootcamp) {
    // call next middleware
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`)
    );
  } else {
    // send the response
    res.status(200).json({ success: true, data: bootcamp });
  }
});

// @desc - post a bootcamp
// @access- private - authentication required
// route - POST /api/v1/bootcamps

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // await for the Promise to get resolved
  const bootcamp = await Bootcamp.create(req.body);
  // send back the resposne - 201: since new resource created
  res.status(201).json({
    succes: true,
    data: bootcamp,
  });
});

// @desc - update a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  // set id, body, run mongoose validators on updated data
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  // if no bootcamp exist
  if (!bootcamp) {
    // return  next middleware if not found
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc - delete a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  // find the document here
  const bootcamp = await Bootcamp.findById(req.params.id);

  // if id is in coorect format but no data found
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
    );
  }

  // trigger the 'middleware -2' in Bootcamp model, and remove bootcamp
  bootcamp.remove();
  // sent the response back
  res.status(200).json({ success: true, msg: 'data deleted' });
});
