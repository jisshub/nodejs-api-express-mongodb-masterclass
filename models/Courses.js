// reuiqre mongoose

const mongoose = require('mongoose');

// define a schmea
const CourseSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
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
  minimumSkill: {
    type: [String],
    required: [true, 'add skills'],
    enum: ['beginner', 'advanced', 'intermediate'],
  },
  scholarshipsAvailable: {
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

// static method to get average cost of courses in a bootcamp
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
        //
        $group: {
          _id: '$bootcamp',
          averageCost: { $avg: '$tuition' }, // get averageCost using avg operator - tuition is the field where v want to find the average.
        },
      },
    ]

    // after the aggregation we get an object with id of bootcampId and averageCost of all tuition in that bootcamp.
  );

  // log the object here
  console.log(obj);
};

// call getAverageCost after save
CourseSchema.post('save', function () {
  // run the static method,
  this.constructor.getAverageCost(this.bootcamp);
});

// call getAverageCost before remove, use pre()
CourseSchema.pre('remove', function () {
  // run the static method here,
  this.constructor.getAverageCost(this.bootcamp);
});

// export the schema
module.exports = mongoose.model('Course', CourseSchema);
