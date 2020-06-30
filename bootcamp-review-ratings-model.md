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

**Screenshot: get all revieews**

![image](./screenshots/p.png 'image')

**Screenshot: get reviews of a bootcamp**

![image](./screenshots/p1.png 'image')

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

**Screenshot**

![image](./screenshots/p2.png 'image')

---

## Add/Create a review for bootcamp

- Only role _user_ has the authority to add review for bootcamp.
  **controllers/reviews.js**

```javascript
// @desc- create review
// @route - POST /api/v1/bootcamps/:bootcampId/reviews
// @access - Private
exports.createReview = asyncHandler(async (req, res, next) => {
  // assign bootcampId to bootcamp in body,
  req.body.bootcamp = req.params.bootcampId;
  // assign current user id to body.user
  req.body.user = req.user.id;

  // find the bootcamp by bootcampId
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  // check bootcamp exist/not
  if (!bootcamp) {
    return new ErrorResponse(
      `bootcamp with id ${req.params.bootcampId} not found`,
      404
    );
  }

  // if user role is not 'user'
  if (req.user.role !== 'user') {
    return next(
      new ErrorResponse(
        `user role ${req.user.role} is not authorized to add a review for bootcamp ${bootcamp._id}`,
        401
      )
    );
  }

  // get review written by current user
  let review = await Review.findOne({
    user: req.user.id,
  });

  // a user can give one review for a bootcamp - if a review added by current user,
  if (review) {
    return next(
      new ErrorResponse(
        `user ${req.user.id} cant post multiple reviews for bootcamp`,
        400
      )
    );
  }

  // if no review added by the current user then add new review
  review = await Review.create(req.body);

  // send resposne
  res.status(201).json({
    success: true,
    review,
  });
});
```

## set routes

**routes/reviews.js**

```javascript
// create route - user protect and authirize middleware here
router.route('/').post(protect, authorize('user'), createReview);
```

## Screenshots

**Screenshot 1: User login**

![image](./screenshots/review-create-3.png 'image')

**Screenshot 2: check role is user**

![image](./screenshots/review_create-4.png 'image')

**Screenshot 3: create POST request**

![image](./screenshots/review_create-1.png 'image')

**Screenshot 4: set authorization type**

![image](./screenshots/review-create-2.png 'image')

**Screenshot 5: Throw error when user try adding multiple reviews**

![image](./screenshots/postman66.png 'image')

---

# Get Average rating of all courses in a bootcamp

**models/Review.js**

```javascript
// find average ratings of courses in a bootcamp. - use statics
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate(
    [
      // match the bootcamp field in Reiview model with bootcampId
      {
        $match: {
          bootcamp: bootcampId,
        },
      },
      // group the id and averageRating
      {
        $group: {
          _id: '$bootcamp',
          averageRating: {
            $avg: '$rating',
          },
        },
      },
    ]
    // we gets an array of one object with bootcamp id and averageRating.
  );
  // save to db,
  try {
    // find bootcamp and update it by adding averageRating field
    await Bootcamp.findByIdAndUpdate(bootcampId, {
      // v access averageRating property from obj.
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.log(error);
  }

  console.log(obj); // obj is an array of single object -
};

// call static method after saving to db & before removing from db
ReviewSchema.post('save', function () {
  // call static methiod on constructor

  this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre('remove', function () {
  // call static methiod on constructor

  this.constructor.getAverageRating(this.bootcamp);
});
```

**Steps to Follow:**

- first delete all data from collections
- register new users - 1 publisher, 2 users role
- Login as publisher role
- create new bootcamp
- login as user role.
- next create a review for newly created bootcamp.
- login as another user role since a user can add only one review.
- next add new review for the same bootcamp.
- get all bootcamps- we can see the _averageRating_ field under that bootcamp.

---

# Update a Review

**controllers/review.js**

```javascript
// @desc - update reviews
// @route - PUT /api/v1/reviews/:id
// @access - Private
exports.updateReview = asyncHandler(async (req, res, next) => {
    let review = await Review.findById(req.params.id)
    if (!review) {
        return next(new ErrorResponse(`review with id ${req.params.id} not found`, 404));
    }
    review = await Review.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: review
    })

```

### set routes

**routes/review.js**

```javascript
router.route('/:id').put(protect, authorize('user')updateReview);
```

## Screenshots:

**Screenshot 1: PUT REQUEST**

![image](./screenshots/review_update-1.png 'image')

**Screenshot 2:**

![image](./screenshots/review-update-2.png 'image')

---

# cascade delete reviews while bootcamp is deleted

**models/Bootcamp.js**

```javascript
// middleware - 3
// cascade delete reviews when a bootcamp is deleted
BootcampSchema.pre('remove', async function (next) {
  // delete review that matches the current bootcamp id with bootcamp field in Review Model.
  await Review.deleteMany({
    bootcamp: this._id,
  });
  // move to next middleware
  next();
});
```

## Screenshots

**Screenshot 1: User Login**

![image](./screenshots/casacade_3.png 'image')

**Screenshot 2: Check User is admin**

![image](./screenshots/cascade_6.png 'image')

**Screenshot 3: Delete Request**

![image](./screenshots/cascade_2.png 'image')

**Screenshot 4: Finally get reviews of a bootcamp**

![image](./screenshots/cascade_1.png 'image')

---

# delete a review

**controllers/reviews.js**

```javascript
// @desc - update reviews
// @route - PUT /api/v1/reviews/:id
// @access - Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);
  if (!review) {
    return next(
      new ErrorResponse(`review with id ${req.params.id} not found`, 404)
    );
  }
  review = await Review.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: review,
  });
});
```

**routes/reviews.js**

```javascript
router.route('/:id', protect, authorize('user'), deleteReview);
```

## Screenshots:

**Screenshot 1: delete request**

![image](./screenshots/delete_review-1.png 'image')

**Screenshot 2: set Authorizatoin type**

![image](./screenshots/delete_review-2.png 'image')

---
