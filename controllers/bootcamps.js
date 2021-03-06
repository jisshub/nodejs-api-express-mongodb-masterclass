// require the models
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const path = require('path');

// create controller method for each routes
// and export

// @desc - get all bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // get response from advancedResult middleware.
  res.status(200).json(res.advancedResult);
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
    res.status(200).json({
      success: true,
      data: bootcamp,
    });
  }
});

// @desc - post a bootcamp
// @access- private - authentication required
// route - POST /api/v1/bootcamps

exports.createBootcamp = asyncHandler(async (req, res, next) => {

  // add user to the req.body.user,
  req.body.user = req.user.id;

  // check bootcamps published by the current user
  const bootcampsPublished = await Bootcamp.findOne({
    user: req.user.id
  })

  // Note: if user is not an admin, add only one bootcamp, else can add any no of bootcamps

  // check if user published a bootcamp and role is not admin,  
  if (bootcampsPublished && req.user.role !== 'admin') {
    // return error since already added a bootcamp
    return next(new ErrorResponse(`the role ${req.user.role} already added one bootcamp- cant add more`, 400))
  }
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
  // find the bootcamp by Id
  let bootcamp = await Bootcamp.findById(req.params.id);
  // if no bootcamp exist
  if (!bootcamp) {
    // return  next middleware if not found
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 401)
    );
  }
  // if current user is not bootcamp owner and his role is not admin, her bootcamp.user is an objec, convert to String.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`user with role ${req.user.role} not authorized to update the bootcamp`));
  };
  // if current user is the user and is also an admin
  // set id, body, run mongoose validators on updated data
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
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

  // if current user is not bootcamp owner and his role is not admin,
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`user with role ${req.user.role} si not athorized to delete this bootcamp`))
  }

  // trigger the 'middleware 2 and 3' in Bootcamp model, and remove bootcamp
  bootcamp.remove();
  // sent the response back
  res.status(200).json({
    success: true,
    msg: 'data deleted',
  });
});

// @desc - Upload a Photo for Bootcamp
// @route - PUT /api/v1/bootcamp/:id/photo
// @access - Private,

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  // find the document by Id,
  const bootcamp = await Bootcamp.findById(req.params.id);
  // if no bootcamp found,
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 400)
    );
  }

  // if current user is not bootcamp owner and his role is not admin,
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`user with role ${req.user.role} not authorized to upload a photo`), 401);
  };

  // if found - but file not uploaded
  if (!req.files) {
    return next(new ErrorResponse(`Photo not Uplaaded`, 400));
  };

  const file = req.files.file;

  // if mimetype is not image. check file type
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please upload an image`, 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`photo size dont exceed 1MB`), 400);
  }

  // create custom file name - parse the file extension,
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log(file.name); //photo_<bootcampId>.jpg

  // move the file to public folder,
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`photo upload failed`, 500));
    }
    // insert file.name to Model,
    await Bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });
    // send back the repsone -> client
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});