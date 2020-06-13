# GEOJSON LOCATION AND GEOCODER HOOKS - MAPQUEST API

---

## installing node-geocoder

npm i node-geocoder

more on : http://nchaulet.github.io/node-geocoder/

## mapquest api

https://developer.mapquest.com/

## set the configurations,

**config/config.env**

```bash
GEOCODER_PROVIDER = mapquest
GEOCODER_API_KEY = 4bGPwn2yy8TtPyMmAAdDRqhVKuwoVnaZ
```

- next, create a js file in utils folder

**utils/geocoder.js**

```javascript
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
```

- Require that geocoder in bootcamp models

**models/bootcamp.js**

- create a middleware to create a locaton field from address field before document saved to db

```javascript
// create a location field suing geocoder before saving to db.
BootcampSchema.pre('save', function (next) {
  this.location = geocoder(this.address);

  next();
});
```
