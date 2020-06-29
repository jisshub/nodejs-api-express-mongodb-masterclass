# Forgot Password

- define a controller for this request

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

  //   send response- with current user
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

  // return original token to resetToken constant in forgotPassword controller.
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

## Send Email

### Using Nodemailer and Mailtrap

<https://nodemailer.com/about/>
<https://mailtrap.io/>

install _nodemailer_

```bash
npm i nodemailer
```

- Set Initial Configs:

**config.env**

```shell
SMTP_HOST =
smtp.mailtrap.io
SMTP_PORT = 2525
SMTP_EMAIL = 20d86a415f7970
SMTP_PASSWORD = 05e34cdd3ec02e
FROM_EMAIL = noreplay@devcamper.io
FROM_NAME = DevCamper
```

- Next create a utility to send emails

**utils/sendEmail.js**

```javascript
const nodemailer = require('nodemailer');

const sendEmail = (options) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let message = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`, // sender address
    to: options.email, // receiver mail
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  };

  // set info
  const info = transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
// export the sendEmail function
module.exports = sendEmail;
```

more on: <https://nodemailer.com/about/>

### use sendEmail utility in auth.js in controllers.

**controllers/auth.js**

```javascript
// @desc - FORGOT password- genrate token
// @route - GET /api/v1/auth/forgotpassword
// @access - Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // find the user with email that matches the email in the body

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

  // save data to current user in db without validation,
  await user.save({
    validateBeforeSave: false,
  });

  // create reset url,
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`;
  // Example: http://locahost:5000//api/resetpassword/tokenvalue

  // set the message
  const message = `you are requested for password reset. make a PUT request to ${resetUrl}`;

  // use sendEmail utility here, <utils/sendEmail.js>
  try {
    // define options object
    await sendEmail({
      email: user.email,
      subject: 'password reset',
      message,
    });

    // send back the response
    res.status(200).json({
      success: true,
      data: 'Email Send',
    });
  } catch (err) {
    // if any error, reset the resetPasswordExpire and resetPassowrdToken fields
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // save to db - NO VALIDATION
    await user.save({
      validateBeforeSave: false,
    });

    // return an error response
    return next(new ErrorResponse(`Email not sent`, 500));
  }
});
```

### ScreenShots

![image](./screenshots/postman_7.png 'image')

---

## Reset Password

**controllers/auth.js**

```javascript
// @desc- reset the password
// @route - PUT /api/v1/auth/resetpassword/:resettoken
// @access - Public

exports.passwordReset = asyncHandler(async (req, res, next) => {
  // first get the hashed token,
  const resetPasswordToken = await crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  // find user using resetPasswordToken and resetPasswordExpire
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });
  // if user found
  if (user) {
    // set new password
    user.password = req.body.password;
    // set resetPasswordToken and resetPasswordExpire to undefined
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // finally save the user
    await user.save();

    // call sendTokenResponse
    sendTokenResponse(user, 200, res);
  } else {
    return next(new ErrorResponse('invalid token', 400));
  }
});
```

- mount the routes for this controller

**routes/auth.js**

```javascript
router.route('/resetpassword/:resettoken').put(passwordReset);
```

### ScreenShots:

**Sending a forgot password POST request**

![image](./screenshots/postman_11.png 'image')

**EMail recievd in Mailtraper profile**

![image](./screenshots/postman_12.png 'image')

- _copy and paste that resettoken from the api for PUT request._

**Send PUT request for password reset in postman**

![image](./screenshots/postman_13.png 'image')

---
