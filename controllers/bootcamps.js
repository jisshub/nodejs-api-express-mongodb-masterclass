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
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    // move to next middleware
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
    // if no bootcamp exist
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    // send the response
    res.status(200).json({ success: true, data: bootcamp });

    // if any other errors in try block, catch here
  } catch (err) {
    // call next() and pass err.
    next(err);
    // if err, move to 'errorHandler' middleware
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

exports.updateBootcamp = async (req, res, next) => {
  try {
    // set id, body, run mongoose validators on updated data
    const bootcamp = await Bootamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // if no bootcamp exist
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });

    // if any other errors in try block, catch here
  } catch (error) {
    res.status(200).json({ error: error });
  }
};

// @desc - delete a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.deleteBootcamp = async (req, res, next) => {
  try {
    // find the document and delete
    await Bootcamp.findByIdAndDelete(req.params.id);

    // sent the response back
    res.status(200).json({ success: true, msg: 'data deleted' });

    // if any error in try block catch here
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
