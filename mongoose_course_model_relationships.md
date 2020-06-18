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
