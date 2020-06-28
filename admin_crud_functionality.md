# Admin CRUD Funcitons

## Only admin user role have the authority to do CRUD operations on users model

- create a controller for this functions

**controllers/users.js**

```javascript
// @desc - get all users
// @route - GET /api/v1/auth/users
// @access - Private
exports.getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  if (!users) {
    return next(new ErrorResponse('no users found', 404));
  }
  res.status(200).json({
    success: true,
    count: users.length(),
    data: users,
  });
});

// @desc GET A SINGLE USER
// @route GET /api/v1/auth/users/:id
// @access - Private
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`no user found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc - CREATE A USER
// @route - POST /api/v1/auth/users
// @access - Private
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc - Update A USER
// @route - PUT /api/v1/auth/users/:id
// @access - Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(
      new ErrorResponse(`no user found with id ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc - DELETE A USER
// @route - DELETE /api/v1/auth/users/:id
// @access - Private
exports.removeUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id, (err) => {
    console.log(err);
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});
```

**routes/users.js**

```javascript
const router = express.Router();

// use protect and authorize middleware for below routes
router.use(protect);
router.use(authorize('admin')); // role should be an admin

// below routes will use protect and authorize.

// set routes
router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').put(updateUser).delete(removeUser).get(getSingleUser);

module.exports = router;
```

**server.js**

```javascript
const users = require('./routes/users');
app.use('/api/v1/auth/users', users);
```

- user should be _admin_ role to do this crud operations - any other role are not allowed to do this. ie admin is only authorized tp access this routes.

### Screenshots

**Screenshot 1: User Login at First**

![image](./screenshots/postman_28.png 'image')

**Screenshot 2: Check Logged-in User role is Admin**

![image](./screenshots/postman_29.png 'image')

**Screenshot 3: create POST request**

![image](./screenshots/postman_25.png 'image')

**screenshot 4: set Authorization type to Bearer Token**

![image](./screenshots/postman_26.png 'image')

- Watch the demo here: <https://youtu.be/FNQ2CBtir2o>
