const express = require('express');
const dotenv = require('dotenv');

// require the xpress router exported
const bootcamps = require('./routes/bootcamps');

// require morgan middleware
const morgan = require('morgan');

// configure dotenv - laod env variables
dotenv.config({ path: './config/config.env' });

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
app.listen(PORT, () => {
  console.log(`App runs in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
