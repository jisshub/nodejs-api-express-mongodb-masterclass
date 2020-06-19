const fs = require('fs');
const path = require('path');
const Bootcamp = require('./models/Bootcamp');
// require Cousre Model
const Course = require('./models/Courses');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// load env vars
dotenv.config({ path: './config/config.env' });

// connect to db
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// read json files synchrounsly
const data = fs.readFileSync('./_data/bootcamps.json', 'utf8');
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

// delete data from db.
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

// set condition to whether import/delete data from db
if (process.argv[2] === '-i') {
  // save data to db.
  importData();
} else if (process.argv[2] === '-d') {
  // delete data from db.
  deleteData();
}

// run, node seeder -i -> import the data to database
// run, node seeder -d -> delete data from db
