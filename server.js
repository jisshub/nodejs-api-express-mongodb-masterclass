const express = require('express');
const dotenv = require('dotenv');

// require the xpress router exported
const bootcamps = require('./routes/bootcamps');

// require morgan middleware
const morgan = require('morgan');

// require connectDB
const connectDB = require('./config/db');

// configure dotenv - laod env variables
dotenv.config({ path: './config/config.env' });

// call connecDB
connectDB();

// initialize express app
const app = express();

// use morgan middlware in devlelopment mode
if (process.env.NODE_ENV === 'development') {
  // use morgan- pass any argument.
  app.use(morgan('tiny'));
}

// use express router
app.use('/api/v1/bootcamps', bootcamps);

// set port - will listen to PORT 5000 always
const PORT = process.env.PORT || 5000;

// listen to port
const server = app.listen(PORT, () => {
  console.log(`App runs in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// unhandlesTejection event occurs throwws erro with message.
// close the server and exit the process.
