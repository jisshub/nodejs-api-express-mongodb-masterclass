const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const path = require('path');

// require the xpress router exported
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require("./routes/users")

// ewquire erroHandler middleware
const errorHandler = require('./middleware/error');

// require morgan middleware
const morgan = require('morgan');

// require connectDB
const connectDB = require('./config/db');
app.use('/api/v1/auth/users', users);

const fileupload = require('express-fileupload');
const cookieParser = require("cookie-parser");



// configure dotenv - laod env variables
dotenv.config({
  path: './config/config.env',
});

// call connecDB
connectDB();

// initialize express app
const app = express();

// parse the json data
app.use(express.json());

// use morgan middlware in devlelopment m ode
const advancedResult = require('./middleware/advancedResults');
if (process.env.NODE_ENV === 'development') {
  // use morgan- pass any argument.
  app.use(morgan('tiny'));
}

// use express-fileupload module here
app.use(fileupload());
// use cookieparser
app.use(cookieParser())



// set public as our static folder,
app.use(express.static(path.join(path.dirname('./'), 'public')));


// use express router
app.use('/api/v1/bootcamps', bootcamps);
// use courses router
app.use('/api/v1/courses', courses);
// use auth router
app.use("/api/v1/auth", auth);
// use admin user route
app.use('/api/v1/auth/users', users);

// use errorHandler middleware
app.use(errorHandler);

// set port - will listen to PORT 5000 always
const PORT = process.env.PORT || 5000;

// listen to port
const server = app.listen(PORT, () => {
  console.log(
    `App runs in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
  );
});

// handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// unhandleRejection event occurs throwws erro with message.
// close the server and exit the process.