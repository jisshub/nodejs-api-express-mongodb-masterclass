// create controller method for each routes
// and export

// @desc - get all bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps

exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: `show all bootcamps` });
};

// @desc - get a bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps/:id

exports.getSingleBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `got bootcamp with id ${req.params.id}` });
};

// @desc - post a bootcamp
// @access- private - authentication required
// route - POST /api/v1/bootcamps

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'posted new bootcamp' });
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
