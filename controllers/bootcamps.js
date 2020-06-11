// require the models
const Bootcamp = require('../models/Bootcamp');

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
      data: bootcamps,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};

// @desc - get a bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps/:id

exports.getSingleBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id, (err, res) => {
      res.status(200).json({
        success: true,
        data: bootcamp,
      });
    });
  } catch (error) {
    res.status(400).json({ error });
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
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};

// @desc - update a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `updated bootcamp with id ${req.params.id}` });
};

// @desc - delete a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `deleted bootcamp with id ${req.params.id}` });
};
