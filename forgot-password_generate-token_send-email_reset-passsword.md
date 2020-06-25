# Forgot Password

**contoller/auth.js**

```javascript
// @desc - FORGOT password- genrate token
// @route - GET /api/v1/auth/forgotpassword
// @access - Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // find the user with email that matches the email in the body
  console.log(req.body.email);

  const user = await User.findOne({
    email: req.body.email,
  });

  // if no user
  if (!user) {
    return next(
      new ErrorResponse(`no user with email ${req.body.email} found`, 404)
    );
  }
  // resetToken constant gets token returned from
  // getResetPasswordToken() method in User model
  const resetToken = user.getResetPasswordToken();

  //   send response
  res.status(200).json({
    user,
  });
});
```

- later create _getRestPassowrdToken()_ method in _User.js_ model

**model/User.js**

```javascript
// generate the token and hash using cryto core module
UserSchema.methods.getResetPasswordToken = function () {
  // generate token to reset password
  const resetToken = crypto.randomBytes(20).toString('hex');

  // hash the token - digest it to string and pass it to resetPasswordToken field in Model.
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // set the token expiry after 10 days - assign it to resetTokenExpire field,
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  // return original token
  return resetToken;
};
```

### Screenshots

Screenshot 1:

![image](./screenshots/postman_4.png 'image')

Screenshot 2:

![image](./screenshots/postman_5.png 'image')

- Now the returned response/data is not saved to db, to save it under the current user in db.

**controllers/auth.js**

```javascript
const resetToken = user.getResetPasswordToken();

// save data to current user in db without validation,
await user.save({
  validateBeforeSave: false,
});
//   send response
res.status(200).json({
  user,
});
```

- Then send request v gets an error:

![image](./screenshots/postman_6.png 'image')

- To solve it, we have to check password field is modified/not. if not call next middleware

```javascript
// middleware - hash password b4 saving to db - use bcrypt
UserSchema.pre('save', async function (next) {
  // check password is modified/not
  if (!this.isModified('password')) {
    next();
  }

  // generates salt using genSalt(10) - 10 - no of rounds - higher rounds - more security.
  const salt = await bcrypt.genSalt(10);

  // get password field - use salt to hash it,
  this.password = await bcrypt.hash(this.password, salt);

  // move to next middlare
  next();
});
```

- Then send the reqeust and check the user collection in db. data is saved

---
