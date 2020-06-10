const express = require('express');
const dotenv = require('dotenv');

// require the xpress router exported
const bootcamps = require('./routes/bootcamps');

// configure dotenv - laod env variables
dotenv.config({ path: './config/config.env' });

// initialze express app
const app = express();

// use express router
app.use('/api/v1/bootcamps', bootcamps);

// set port - will listen to PORT 5000 always
const PORT = process.env.PORT || 5000;

// listen to port
app.listen(PORT, () => {
  console.log(`App runs in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
