// require mongoose
const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./User');
const Review = require('./Review');

// defne a Schema

const BootcampSchema = mongoose.Schema({
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
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'pleae use a valid url with http',
    ],
    required: [true, 'website is required'],
  },
  phone: {
    type: String,
    unique: true,
    maxlength: [20, 'not more than 15'],
    required: [true, 'phone number required']
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please enter valid email',
    ],
    required: [true, 'email is required'],
  },
  address: {
    type: String,
    required: [true, 'address is required'],
  },
  location: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
  },
  careers: {
    //   array of strings
    type: [String],
    enum: [
      'Web Development',
      'Data Science',
      'Mobile Development',
      'UI/UX',
      'Business',
      'Other',
    ],
  },
  housing: {
    type: Boolean,
    default: false,
  },
  averageRating: {
    type: Number,
    min: [1, 'mininum rating is atleast 1'],
    max: [10, 'rating should not exceed 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  accceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    // set to current date and time
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
}, {
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },
});

// middleware -1
// runs before document is saved to the db.
// dont use callback fn here,
BootcampSchema.pre('save', function (next) {
  // create a slug field using name field
  this.slug = slugify(this.name, {
    lower: true
  });

  console.log(this.slug);
  // move to next middleware
  next();
});

// middleware - 2
// cascase delete course when a bootcamp is deleted. use pre() means, runs before removing bootcamp from db.
BootcampSchema.pre('remove', async function (next) {
  // select Course model - match 'bootcamp' field of Course with '_id' field of Bootcamp.
  // if both matches delete courses in that matched bootcamp.
  await this.model('Course').deleteMany({
    bootcamp: this._id
  });
  // move to next middleware
});

// middleware - 3
// cascade delete reviews when a bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  // delete review that matches the current bootcamp id with bootcamp field in Review Model.
  await Review.deleteMany({
    bootcamp: this._id
  });
  // move to next middleware
  next()
})

// reverse populate
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false,
});

// export the schema created
module.exports = mongoose.model('Bootcamp', BootcampSchema);

// Bootcamp is the model created automatcally,