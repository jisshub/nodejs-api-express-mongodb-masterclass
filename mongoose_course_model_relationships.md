# course model

```javascript
// reuiqre mongoose

const mongoose = require('mongoose');

// define a schmea
const CourseSchema = mongoose.Schema({
  trim: {
    type: String,
    required: [true, 'name is reuired'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'add a description'],
  },
  weeks: {
    type: String,
    required: [true, 'add numebr of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'add tuition cost'],
  },
  minimumSkillRequired: {
    type: [String],
    required: [true, 'add skills'],
    enum: ['beginner', 'advanced', 'intermediate'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
    required: [true, 'add skills'],
    enum: ['beginner', 'advanced', 'intermediate'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
});

// export the schema
module.exports = mongoose.model('Course', CourseSchema);
```

## adding seeder functionalityt for course model

**seeder.js**

```javascript
// get courses
const courses = fs.readFileSync('./_data/courses.json', 'utf8');
// import data to db.
const importData = async () => {
  try {
    //  parse the json array to an array of object - resolve the data - save to db.
    await Bootcamp.create(JSON.parse(data));
    await Course.create(JSON.parse(courses));
    // green.inverse - color of log message
    console.log('Data saved'.green.inverse);
    // exit the process
    process.exit();
  } catch (error) {
    //   log errors
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log('Data deleted..'.red.inverse);
    // finally exit the process
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// run, node seeder -i -> import the data to database
// run, node seeder -d -> delete data from db
```

## controller and routes

---

- GET {{URL}}/api/v1/courses/ -> get all courses

- GET {{URL}}/api/v1/bootcamps/5d713995b721c3bb38c1f5d0/courses -> get courses of a bootcamp

---

**controllers/courses.js**

```javascript
// @desc - get all courses, get course spcific to a bootcamp
// @access - public
// @route - GET /api/v1/courses
// @route - GET /api/v1/bootcamps/    :bootcampId/courses

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;
  // check whether there is bootcampId as req.params/not.
  if (req.params.bootcampId) {
    // if yes get courses in that bootcamp
    // that bootcampId must match with bootcamp field of Courses model
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    // else, get all courses
    query = Courses.find();
  }

  // execute the query
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
```

**routes/courses.js**

```javascript
// set mergeParams to true - used to merge params from other routes
const router = express.Router({ mergeParams: true });
// create routes

const { getCourses } = require('../controllers/courses');

// set routes
router.route('/').get(getCourses);

// export the router
module.exports = router;
```

**routes/bootcamps.js**

```javascript
// re-route/use courseRouter.
router.use('/:bootcampId/courses', courseRouter);

// here v basically re route to courseRouter. when there is above given api is given
```

## using populate() to get the data from other model,

**controllers/courses.js**

```javascript
query = Courses.find().populate('bootcamp', 'name description');

// get courses along with bootcamp name and description
```

- _bootcamp_ - fiels in course,
- _name, description_ - fields needed from bootcamp.

## using reverse populate.

- so the task is to **get the bootcamps along with array of courses** in each one.

- v use **virtual** to accompolish this,

- First,

**toJSON** - conbert the document to json,
_doc.toJSON({ virtuals: true })_

**toObject** - Converts this document into a plain javascript object, ready for storage in MongoDB.

_doc.toObject({ virtuals: true })_

**models/Bootcamp.js**

```javascript
const BootcampSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please add a name'],
      maxlength: [50, 'not more thaan 50 characters'],
      trim: true,
      unique: true,
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'please add description'],
      maxlength: [500, 'not more than 500 chars'],
    },
  },
  // apply toJSON, toObject, set virtual property to true
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// reverse populate
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

// courses - field name for the new array of movies
// ref - model we want to set reference to
// localField - id of bootcamp model,
// foreignfiedl - foreign field in course model that relates to _id in Course mode
// justOne - means need just one array of courses
```

---

**controllers/bootcamp.js**

```javascript
// pass queryStr to query - parse it to js object - populate the courses in each bootcamp
query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

// courses - field name for that array
```

## using cascase delete.

### cascade delete courses while bootcamp is deleted,

**models/Bootcamp.js**

```javascript
// middleware - 2
// cascase delete course when a bootcamp is deleted. use pre() means, runs before removing bootcamp from db.
BootcampSchema.pre('remove', async function (next) {
  // select Course model - match 'bootcamp' field of Course with '_id' field of Bootcamp.
  // if both matches delete courses in that matched bootcamp.
  await this.model('Course').deleteMany({ bootcamp: this._id });
  // move to next middleware
});
```

- we cant access the this.\_id of bootcamp since we use pre() ie before deleting the bootcamp

- **Next to trigger this middleware we have use remove() in controllers**.

---

**controllers/bootcamps.js**

```javascript
exports.deletBootcamp = asyncHandler(_aysnc (req, res, next) => {
  // find the document here
  const bootcamp = await Bootcamp.findById(req.params.id);

  // if id is in coorect format but no data found
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
    );
  }

  // trigger the 'middleware -2' in Bootcamp model, then remove bootcamp
  bootcamp.remove();
  // sent the response back
  res.status(200).json({ success: true, msg: 'data deleted' });

})
```

## get single course

**controllers/bootcamp.js**

```javascript
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
```

## create new course

**controllers/bootcamp.js**

```javascript
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
```

**routes/bootcamps.js**

```javascript
// set routes
router.route('/').get(getCourses).post(createCourse);
```

---

## update a course

**controllers/courses.js**

```javascript
// @PUT - update a course
// @route - PUT /api/v1/course/:id
// @access - Private

exports.updateACourse = asyncHandler(async (req, res, next) => {
  // find course by id.
  let course = await Courses.findById(req.params.id);
  // if no course exist
  if (!course) {
    return next(
      new ErrorResponse(`course with id ${req.params.id} no found`),
      404
    );
  }
  // if course exist, update the course
  course = await Courses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // send back the response -> client
  res.status(200).json({
    success: true,
    data: course,
  });
});
```

**routes/courses.js**

```javascript
router.route('/:id').put(updateACourse);
```

---

## delete a course

**controllers/courses.js**

```javascript
// @desc - delete a course
// @route - DELETE /api/v1/courses/:id
// @access- private

exports.deleteACourse = asyncHandler(async (req, res, next) => {
  // find the course
  let course = await Courses.findById(req.params.id);
  // if course found DELETE it,
  if (course) {
    course = await Courses.findByIdAndDelete(req.params.id);
    // send back the resposne to client
    res.status(200).json({
      success: true,
      msg: 'data deleted',
    });
  }
  // if course not found,
  return next(new ErrorResponse(`course not found with id ${req.params.id}`));
});
```

**routes/courses.js**

```javascript
router.route('/:id').delete(deleteACourse);
```

## finding average cost of all courses in a bootcamp

**models/Courses.js**

```javascript
// create a static method to get average cost of courses in a bootcamp
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log(`Calculating the average cost of tuitions`.blue);

  // aggregations - call an aggregate method that returns a Promise, use await,
  // aggregate method takes an array called pipeline

  const obj = await this.aggregate(
    [
      {
        // match the bootcamp field with bootcampId passed as parameter
        $match: { bootcamp: bootcampId },
      },
      {
        // group takes 2 data - bootcampId, averageCost
        $group: {
          _id: '$bootcamp',
          averageCost: { $avg: '$tuition' }, // get averageCost using avg operator - tuition is the field where v want to find the average.
        },
      },
    ]

    // after the aggregation we get an array of single object with id of bootcampId and averageCost of all tuition in that bootcamp.
  );

  // save to db
  try {
    // use Bootcamp Model - find & update bootcamp using bootcampId - pass data to be added ie. averageCost
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      // obj -> array of one object -> convert to integer
      averageCost: Math.ceil(obj[0].averageCost),
    });
  } catch (error) {
    console.error(error);
  }

  // log the object here
  console.log(obj);
};

// call getAverageCost after save
CourseSchema.post('save', function () {
  // run the static method here,
  this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost before remove, use pre()
CourseSchema.pre('remove', function () {
  // run the static method here,
  this.constructor.getAverageCost(this.bootcamp);
});
```

_Note:_

- here first post courses under a specific bootcamp.
- later, find that specific bootcamp to view field 'averageCost' of all tuitions added in that bootcamp .

---
