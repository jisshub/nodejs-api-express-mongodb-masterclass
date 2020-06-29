# Create a model

**models/Review.js**

```javascript
const mongoose = require('mongoose');

// define a Schema for review
const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please add a review title'],
    maxlength: 50,
  },
  text: {
    type: String,
    required: [true, 'please add some text'],
    maxlength: 500,
  },
  rating: {
    type: Number,
    required: [true, 'please give a rating b/w 1 and 10'],
    min: 1,
    max: 10,
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
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// export the schema
module.exports = mongoose.model('Review', ReviewSchema);
```

note- _reviews models has reference set to User and Bootcamp model._

## adding seeder functionality

**seeder.js**

```javascript
const Review = require('./models/Review');

// get reviews file
const reviews = fs.readFileSync('/_data/reviews.json', 'utf8');

// import data to db.
const importData = async () => {
  try {
    //  parse the json array to an array of object - resolve the data - save to db.
    await Review.create(JSON.parse(reviews));
    // green.inverse - color of log message
    console.log('Data saved'.green.inverse);
    // exit the process
    process.exit();
  } catch (error) {
    //   log errors
    console.log(error);
  }
};

// delete data from db.
const deleteData = async () => {
  try {
    await Review.deleteMany();
    console.log('Data deleted..'.red.inverse);
    // finally exit the process
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
```

## create controllers

**controllers/reviews.js**

```javascript
// @desc - GET All Reviews
// @route - GET /api/v1/reviews,
// @route - GET /api/v1/bootcamps/:bootcampId/reviews
// @access - Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  let query;
  // check if params have bootcampId,
  if (req.params.bootcampId) {
    // get reviews of that specific bootcamp
    query = Review.find({
      bootcamp: req.params.bootcampId,
    });
  } else {
    // get all reviews if no params
    query = Review.find().populate('bootcamp', 'name description');
  }
  // exceute the query
  const reviews = await query;
  // send back response
  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});
```

## set routes

**routes/reviews.js**

```javascript
const router = express.Router({
  mergeParams: true,
});

// routes
router.route('/').get(getReviews);

// export the router
module.exports = router;
```

**routes/bootcamp.js**

```javascript
const reviewRouter = require('./reviews');
// re-route to reviewRouter it v get below api
router.use('/:bootcampId/reviews', reviewRouter);
```

## Use the routes in server file

**server.js**

```javascript
// use reviews routes
app.use('/api/v1/reviews', reviews);
```

---

## Get single review

**controllers/reviews.js**

```javascript
// @desc - GET a single review
// @route - GET /api/v1/reviews/:id
// @access - Private
exports.getSingleReview = asyncHandler(async (req, res, next) => {
  // get review and polulate the result with bootcamp name, description
  const review = await Review.findById(req.params.id).populate(
    'bootcamp',
    'name description'
  );
  if (!review) {
    return next(new ErrorResponse('no review found', 404));
  }
  res.status(200).json({
    success: true,
    data: review,
  });
});
```

**routes/reviews.js**

```javascript
router.route('/:id').get(getSingleReview);
```
