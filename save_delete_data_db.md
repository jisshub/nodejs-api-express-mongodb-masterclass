# database seeder - saving data to db and deleting data from db using file

```javascript
const fs = require('fs');
const path = require('path');
const Bootcamp = require('./models/Bootcamp');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const { dirname } = require('path');

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

console.log(data);

// import data to db.
const importData = async () => {
  try {
    //  parse the json array to an array of object - resolve the data - save to db.
    await Bootcamp.create(JSON.parse(data));
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
```
