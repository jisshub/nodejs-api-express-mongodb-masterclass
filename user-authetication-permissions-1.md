# User Authentication - 1

## initial set up

- create a model called, User.js

**models/User.js**

```javascript
// require mongoose
const mongoose = require('mongoose');

// define a UserSchmea
const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'please add a name'],
  },
  email: {
    type: String,
    required: [true, 'please add an email'],
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'please enter valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: [true, 'please add password'],
    select: false,

    // select: false means doesnt returns the 'password' when v get a user.
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// export the schema -
module.exports = mongoose.Model('User', UserSchema);
```

---

- set controllers and routes

**controllerd/auth.js**

```javascript
// @desc - user registeration
// @routes - POST /api/v1/auth/registet
// @access - Public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
  });
});
```

**routes/auth.js**

```javascript
const router = express.Router();

// set route - user register controller
router.route('/register').post(register);

// export
module.exports = router;
```

- use auth router

**server.js**

```javascript
// require router
const auth = require('./routes/auth');
// use auth router
app.use('/api/v1/auth', auth);
```

---

**POSTMAN**

- create new folder for Aithentication in postman
- set _POST_ request,

_POST {{URL}}/api/v1/auth/register_

---

## User Register - Encrypt Password
