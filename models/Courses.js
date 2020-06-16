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

// export the schema
module.exports = mongoose.model('Course', CourseSchema);
