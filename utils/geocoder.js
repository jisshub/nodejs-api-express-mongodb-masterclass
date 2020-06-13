const NodeGeocoder = require('node-geocoder');
const { model } = require('../models/Bootcamp');

const options = {
  // set provider
  provider: process.env.GEOCODER_PROVIDER,

  // Optionnal depending of the providers
  httpAdapter: 'https', // Default
  apiKey: process.env.GEOCODER_API_KEY, // for Mapquest, OpenCage, Google Premier
  formatter: null, // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

// export the geocoder
module.exports = geocoder;
