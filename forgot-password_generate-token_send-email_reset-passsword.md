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

  console.log(resetToken);
});
```

- later create _getRestPassowrdToken()_ method in _User.js_ model

**model/User.js**

```javascript
// match user entered password with hashed password
UserSchema.methods.matchPasswords = async function (userEnteredPassword) {
  // compare passwords - return true/false, use compare()
  return await bcrypt.compare(userEnteredPassword, this.password);
  // this.password - hashed one
};

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

  // log the data
  console.log('reset password token:', this.resetPasswordToken);
  console.log('reset password expire:', this.resetPasswordExpire);

  // return original token
  return resetToken;
};
```
