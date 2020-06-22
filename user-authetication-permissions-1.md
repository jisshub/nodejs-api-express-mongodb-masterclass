# User Authentication - 1

## initial set up

- package installtions

```bash
npm i jsonwebtoken
npm i bcryptjs

```

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

### hash the password using bcrypt before saving to db

**models/User.js**

```javascript
// middleware - hash password b4 saving to db - use bcrypt
UserSchema.pre('save', async function (next) {
  // generates salt using genSalt(10), 10 - no of rounds - higher rounds - more security.
  const salt = await bcrypt.genSalt(10);

  // get password field - use salt to hash it,
  this.password = await bcrypt.hash(this.password, salt);

  // move to next middlware
  next();
});
```

## JSON WEBTOKEN

![image](./screenshots/JSONWEBTOKEN_DETAIL.png 'image')

- three parts -

1. HEADER
2. PAYLOAD
3. SIGNATUER

more on : <https://jwt.io/>

---

**config/config.env**

```bash
JWT_SECRET = uwteusdjghsdjfzjdghs
JWT_EXPIRE = 30d

# token expires in 30 days
```

**models/User.js**

```javascript
// sign json web token & return
// create a method - methods calls on Document, statics calls on Model

UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      // pertains to currect document / here user, since v use methods here
      id: this._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES }
  );
};
```

---

- syntax:

```javascript
jwt.sign(
  {
    data: 'foobar',
  },
  'secret',
  { expiresIn: '1h' }
);
```

more on : <https://www.npmjs.com/package/jsonwebtoken>

**controllers/auth.js**

- finally call this method in controllers on user

```javascript
// create token for current user - invoke getSignedJwtToken method on current user.
const token = user.getSignedJwtToken();

// send back the repsonse -> client
res.status(200).json({
  success: true,
  token: token,
});
```
