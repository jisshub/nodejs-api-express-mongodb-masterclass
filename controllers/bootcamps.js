// require the models
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// create controller method for each routes
// and export

// @desc - get all bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    // next middleware - middleware/error.js
    next(err);
  }
};

// @desc - get a bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps/:id

exports.getSingleBootcamp = async (req, res, next) => {
  try {
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

    // if id is not in correct format / any other erros pops up.
  } catch (err) {
    next(err);
  }
};

// @desc - post a bootcamp
// @access- private - authentication required
// route - POST /api/v1/bootcamps

exports.createBootcamp = async (req, res, next) => {
  {
    try {
      // await for the Promise to get resolved
      const bootcamp = await Bootcamp.create(req.body);

      // send back the resposne - 201: since new resource created
      res.status(201).json({
        succes: true,
        data: bootcamp,
      });
      // if any error, catch the error
    } catch (err) {
      // call next middleware
      next(err);
    }
  }
};

// @desc - update a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.updateBootcamp = async (req, res, next) => {
  try {
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

    // if id is not in correct format / any other erros pops up.
  } catch (err) {
    next(err);
  }
};

// @desc - delete a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.deleteBootcamp = async (req, res, next) => {
  try {
    // find the document and delete
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    // if id is in coorect format but no data found
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
      );
    }
    // sent the response back
    res.status(200).json({ success: true, msg: 'data deleted' });

    // if id is not in correct format / any other erros pops up.
  } catch (err) {
    next(err);
  }
};
