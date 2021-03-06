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
2. PAYLOAD - includes Data like id, expiresin
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

## User Login

- Created _Token_ includes _userid_ with in the _payload_

**controllers/auth.js**

```javascript
// @desc - user login
// @route - POST /api/v1/auth/login
// access - Public

exports.login = asyncHandler(async (req, res, next) => {
  // get email, passpwrd from input
  const { email, password } = req.body;

  // validate email, password
  if (!email || !password) {
    return next(new ErrorResponse('no email and password', 400));
  }

  // if inputs given, check user exist in db/not by matching email with email in db, select password to validate
  const user = await User.findOne({
    email,
  }).select('+password');

  // if no user exist,
  if (!user) {
    return next(new ErrorResponse('invalid credential given', 401));
  }

  // check if password matches with hashed one  - pass password as argument, use await, since v use await before bcrypt.compare()
  const isMatch = await user.matchPasswords(password);

  // if password not match
  if (!isMatch) {
    return next(new ErrorResponse('invalid cedentials', 401));
  }

  // if matches, create token and send success repsonse to client

  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token: token,
  });
});
```

## compare user entered password with hashed one

**models/User.js**

```javascript
// match user entered password with hashed password
UserSchema.methods.matchPasswords = async function (userEnteredPassword) {
  // compare passwords - return true/false, use compare()
  return await bcrypt.compare(userEnteredPassword, this.password);
  // this.password- hashed one
};
```

### set routes here,

**routes/auth.js**

```javascript
router.route('/login').post(login);
```

- screenshot here,

![image](./screenshots/postman_user_login.png 'image')

---

# sending jwt token in cookie

- install cookie-parser package

```bash
npm i cookie-parser
```

more on: <https://www.npmjs.com/package/cookie-parser>

**config/config.env**

```javascript
JWT_COOKIE_EXPIRE = 30;
```

**controllers/auth.js**

```javascript
// get token, create cookie and send token with in cookie as respone
const sendTokenCookie = (user, statusCode, res) => {
  // if matches, create token and send success repsonse to client
  const token = user.getSignedJwtToken();

  // set options for the cookie
  const options = {
    // cookie expires in current date + 30 days.
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),

    // cookie accessible only thru client side script, set httpOnly to true
    httpOnly: true,
  };

  // if production mode, set secure property to true,
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
    // if true, cookie will sent with https protocol,
  }

  // send back the response with cookie having token in it.
  res.status(statusCode).cookie('cookie-1', token, options).json({
    success: true,
    token: token,
  });
};
```

- next, call the sendTokenCookie() from the register and login controllers.

```javascript
// @desc - user registeration
// @routes - POST /api/v1/auth/registet
// @access - Public
exports.register = asyncHandler(async (req, res, next) => {
  // pull the data  from req.body,
  const { name, email, password, role } = req.body;

  // create user - pass fields as object
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // invoke sendTokenCookie() - pass arguments
  sendTokenCookie(user, 200, res);
});

// @desc - user login
// @route - POST /api/v1/auth/login
// access - Public

exports.login = asyncHandler(async (req, res, next) => {
  // get email, passpwrd from input
  const { email, password } = req.body;

  // validate email, password
  if (!email || !password) {
    return next(new ErrorResponse('no email and password', 400));
  }

  // if inputs given, check user exist in db/not by matching email with email in db, select password to validate
  const user = await User.findOne({
    email,
  }).select('+password');

  // if no user exist,
  if (!user) {
    return next(new ErrorResponse('invalid credentials', 401));
  }

  // check if password matches - pass password as argument - use await, since v use await before bcrypt.compare()
  const isMatch = await user.matchPasswords(password);

  // if password not match
  if (!isMatch) {
    return next(new ErrorResponse('invalid cedentials', 401));
  }

  // invoke sendTokenCookie() - pass args
  sendTokenCookie(user, 200, res);
});
```

# sending token to routes - enabling authorized users to work on those routes

- protect the routes using token

**middleware/auth.js**

```javascript
// protect the routes with token
exports.protect = asyncHandler(async (req, res, next) => {
  //initialze token
  let token;
  // check authorization header is given and its value starts with 'Bearer' - access headers with 'req.headers'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // split req.headers.authorization into an array and get the token from it.
    token = req.headers.authorization.split(' ')[1];
  }
  // if token not exists
  if (!token) {
    return next(new ErrorResponse('not authorized to access the route', 401));
  }

  // verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    // decoded = { id: '5ef0594deb5f495dbceacfca', iat: 1592903813, exp: 1595495813 }

    // decoded has an id - use it to find the current user.
    req.user = await User.findById(decoded.id);

    next();
  } catch (err) {
    return next(new ErrorResponse('not authorzed tp access the route', 401));
  }
});
```

- next , use this middleware before routes that require private access.

**routes/bootcamp.js**

```javascript
// require protect middleware
const { protect } = require('../middleware/auth');

// use it
post(protect, createBootcamp);
put(protect, updateBootcamp);

// use that protect middleware protect before controllers.
```

**routes/courses.js**

```javascript
// require protect middleware
const { protect } = require('../middleware/auth');

// use it
post(protect, createCourses);
put(protect, updateCourse);

// use that protect middleware protect before controllers.
```

- now if want to post, put , delete a data a token to be sent to that route for the authorization purpose. ie the user should be logged in.

- else throws error,

- postman set up:

![image](./screenshots/postman_authorization.png 'image');

---

## Accessng the current logged in user

- have to create new controller for that in auth,js

**controller/auth.js**

```javascript
// @desc - get the current logged in user
// @route - GET /api/v1/auth/me
// access - Private

exports.getMe = asyncHandler(async (req, res, next) => {
  // get the user
  const user = await User.findById(req.user.id);
  // send back the response
  res.status(200).json({
    success: true,
    data: user,
  });
});
```

- now create a route for this.

```javascript
router.route('/me').get(protect, getMe);
```

- In Postman,

![image](./screenshots/getcurrent_logged_user.png 'image');

---

## Automatically Storing the Token in postman

- Screenshot:

![image](./screenshots/setting_tests.png 'image');

- As in the image here we get the token while login and put that token in "TOKEN" variable.
  later save the Tests.

- Same as in register route as well.

---

Next to use this Token in diiferent routes -
We have to Auhotrization for each routes

- Screenshots:

![image](./screenshots/Autorization.png 'image')

- Select Type as Bearer Token and Token Variable

---

**For Example for delete a bootcamp** ,

We can set the Authorization as below,

![image](./screenshots/Authorization_2.png 'image')

- So for each protected routes we have tp set _Authorization_ like above. Thus saves the time because we dont have to generate a token each time v use this routes.

---

# Authorizing the Roles

**controllers/auth.js**

```javascript
// grant access to the spcific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // check if current user role is included in roles array recieved,

    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `not authorized to access the route by ${req.user.role}`,
          403
        )
      );
      // 403 - client not have access to the requested resource
    }
    next();
  };
};
```

- Next speicfy call this middleare in the routes to make it accessible for given roles only

**routes/bootcamp.js**

```javascript
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

// route for bootcamp photo uplaod
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

// so here only publisher and admin have the persmission to access these routes. ie they have the authority to create and manage bootcamps.
```

- note, use authorize() after protect middleware since v require req.user for authorize() which gets from protect middleware.

* same in case for _course routes_ too.

**routes/courses.js**

```javascript
router
  .route('/')
  .get(getCourses)
  .post(protect, authorize('pulisher', 'admin'), createCourse);

//
router
  .route('/:id')
  .get(getSingleCourse)
  .put(protect, authorize('publisher', 'admin'), updateACourse)
  .delete(protect, authorize('publisher', 'admin'), deleteACourse);
```

---
