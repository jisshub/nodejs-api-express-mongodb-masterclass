# User Authentication Part 2

## Bootcamp & User RelationShip

- Add a user field in bootcamp model that reference to the User model.

```javascript
user: {
    type: mongoose.STATES.ObjectId,
    ref: 'User',
    required: true
  }
```

- to add user field to bootcamp changes to controllers

**controllers/bootcamps.js**

```javascript
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add current user's id to the req.body.user field in the document
  req.body.useruser = req.user.id;

  // check bootcamps published by the current user
  const bootcampsPublished = await Bootcamp.findOne({
    user: req.user.id,
  });

  // Note: if user is not an admin, add only one bootcamp, else can add any no of bootcamps

  // check if user published a bootcamp and role is not admin,
  if (bootcampsPublished && req.user.role !== 'admin') {
    // return error since already added a bootcamp
    return next(
      new ErrorResponse(
        `the role ${req.user.role} already one bootcamp- cant add more`,
        400
      )
    );
  }
  // await for the Promise to get resolved
  const bootcamp = await Bootcamp.create(req.body);

  // send back the resposne - 201: since new resource created
  res.status(201).json({
    succes: true,
    data: bootcamp,
  });
});
```

- later update the database seeder ie, **seeder.js**

* delete all current data

```bash
node seeder -d
```

In postman,

1. register new user

2. later, create new bootcamp

3. this newly created boocamp will have yhe _user field_ with id of current logged in user.

### Screenshot 1 - get logged in user:

![image](./screenshots/imageedit_2_5795774125.png 'image')

### Screenshot 2 - post bootcamp after login:

![image](./screenshots/imageedit_5_9486120982.png 'image')

---

## Setting Ownership for the bootcamp

- suppose a user created a bootcamp- only he should have tht permisson to update that bootcamp - not other user can manage that bootcamp.
- so v set ownership for that bootcamp.
- thus it can be managed by the user who owns it. not others.

### Updating the bootcamp by its owner

**controllers/bootcamp.js**

```javascript
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  // find the bootcamp by Id
  let bootcamp = await Bootcamp.findById(req.params.id);
  // if no bootcamp exist
  if (!bootcamp) {
    // return  next middleware if not found
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
    );
  }
  // if current user is not bootcamp owner and his role is not admin, her bootcamp.user is a field in bootcamp which is an object,so  convert to String.
  // before comparing with current user id.
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `user with role ${req.user.role} not authorized to update the bootcamp`
      )
    );
  }
  // if current user is the owner and is also an admin
  // set id, body, run mongoose validators on updated data
  bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
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

  // trigger the 'middleware -2' in Bootcamp model, and remove bootcamp
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

```

## OwnerShip for Courses

- here only the bootcamp owner and also who is an admin can create the course- not others

* first set a reladtionship b/w User and Course

**models/Courses.js**

```javascript
// add a  user field
user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
```

**contollers/courses.js**

```javascript
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

```
