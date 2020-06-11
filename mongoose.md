# connection to the database with mongoose

- create a db.js file in config folder

- write the connection code in that file.

**config.env**

```shell
MONGO_URI = mongodb+srv://jissmonJose:YsX6ghrRid3aK9Fx@cluster101-wqs3s.mongodb.net/devcamper?retryWrites=true&w=majority
```

**YsX6ghrRid3aK9Fx** - password
**jissmonJose** - username

**db.js**

```javascript
// require mongoose here
const mongoose = require('mongoose');

// connect to db
const connectDB = async () => {
  // mongoose.connect() -> Promise - to resolve Promise, use 'await'
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log('MongoDb Connected to ' + conn.connection.host);
};

// export the
module.exports = connectDB;
```

**server.js**

```javascript
// require connectDB
const connectDB = require('./config/db');
// call connecDB
connectDB();

// listen to port
const server = app.listen(PORT, () => {
  console.log(`App runs in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// unhandledRejection event occurs throwws erro with message.
// close the server and exit the process
```

## creating the Model

- create models directory
- create a Bootcamp.js file (Name begins swith Captials)

**Bootcamp.js**

```javascript
// require mongoose
const mongoose = require('mongoose');

// defne a Schema

const BootcampSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
    maxlength: [50, 'not more thaan 50 characters'],
    trim: true,
    unique: true,
  },
  slug: String,
  description: {
    type: String,
    required: [true, 'please add description'],
    maxlength: [500, 'not more than 500 chars'],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'pleae use a valid url with http',
    ],
    required: [true, 'website is required'],
  },
  phone: {
    type: String,
    unique: true,
    maxlength: [15, 'not more than 15'],
    required: [true, 'phone number required'],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please enter valid email',
    ],
    required: [true, 'email is required'],
  },
  address: {
    type: String,
    required: [true, 'address is required'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere',
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    country: String,
    zipcode: String,
  },
  career: {
    //   array of strings
    type: [String],
    enum: [
      'Web Development',
      'Data Science',
      'Mobile Development',
      'UI/UX',
      'Business',
      'Other',
    ],
  },
  averageRating: {
    type: Number,
    min: [1, 'mininum rating is atleast 1'],
    max: [10, 'rating should not exceed 10'],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  accceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    // set to current date and time
    default: Date.now,
  },
});

// export the schema created
module.exports = mongoose.model('Bootcamp', BootcampSchema);
```

- **Bootcamp** is the model created automatcally,

- enum - only value it posses - cant give other values - if provides other vakue - that is rejected.

* Example

```javascript
enum: [
  'Web Development',
  'Data Science',
  'Mobile Development',
  'UI/UX',
  'Business',
  'Other',
];
```

- if given other values- that value is rejected.

* Slug and Name fields

```json

"name": "Devworks Bootcamp"
"slug": "devworks-bootcamp",

```

**controllers/bootcamp.js**

## POST data - create bootcamp

```javascript
// require Bootcamp Model
const Bootcamp = require('../models/Bootcamp');

exports.createBootcamp = async (req, res, next) => {
  {
    try {
      // await for the Promise to get resolved
      const bootcamp = await Bootcamp.create(req.body);

      // send back the resposne - 201: since new resource created
      res.status(201).json({
        succes: true,
        data: bootcamp,
      });
      // if any error, catch the error
    } catch (error) {
      res.status(400).json({ error });
    }
  }
};
```

---

## NOTE: cant add a field to the database that re not in the model, mongodb will ignore that field from adding to the db. only the fields gven in the model is added to the db. but no error pops up if v try,

## GET data - get all bootcamp

```javascript
exports.getBootcamps = async (req, res, next) => {
  try {
    // use find() to get all data.
    const bootcamps = await Bootcamp.find();
    // send back the response to the client
    res.status(200).json({
      success: true,
      data: bootcamps,
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
};
```

## GET a single bootcamp using id

```javascript
exports.getSingleBootcamp = async (req, res, next) => {
  try {
    // use findById()
    const bootcamp = await Bootcamp.findById(req.params.id);

    // if no bootcamp exist
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    // send the response
    res.status(200).json({ success: true, data: bootcamp });

    // if any other errors in try block, catch here
  } catch (error) {
    res.status(400).json({ error });
  }
};
```

## PUT - update a bootcamp using id

```javascript
exports.updateBootcamp = async (req, res, next) => {
  try {
    // set id, body, run mongoose validators on updated data
    const bootcamp = await Bootamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // if no bootcamp exist
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });

    // if any other errors in try block, catch here
  } catch (error) {
    res.status(200).json({ error });
  }
};
```

## DELETE - delete a bootcamp with id

```javascript
exports.deleteBootcamp = async (req, res, next) => {
  try {
    // find the document and delete
    await Bootcamp.findByIdAndDelete(req.params.id);
    // sent the response back
    res.status(200).json({ success: true, msg: 'data deleted' });

    // if any error in try block catch here
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
```
