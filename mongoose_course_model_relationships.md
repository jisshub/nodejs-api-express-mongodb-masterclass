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

- GET {{URL}}/api/v1/courses/  -> get all courses

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
