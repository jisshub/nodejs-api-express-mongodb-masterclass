# Update User Password

- create a user updateapssword controller

**controllers/auth.js**

```javascript
// @desc - UPDATE USER PASSSWORD
// @route - PUT /api/v1/auth/updatepassword
// @access - Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  // find the user
  const user = await User.findById(req.user.id).select('+password');

  // check if current password in body matches with password in db, call matchPassword method in middleware
  if (!(await user.matchPasswords(req.body.currentPassword))) {
    return next(new ErrorResponse('Password is Incorrect', 401));
  }
  // assign new password to user
  user.password = req.body.newPassword;
  // save
  await user.save();
  // send token response if password is changed.
  sendTokenResponse(user, 200, res);
});
```

- next add the controller in routes

**routes/auth.js**

```javascript
router.route('/updatepassword').put(protect, updatePassword);
```

### Screenshots:

Screenshot 1:

![image](./screenshots/postman14.png 'image')

Screenshot 2:

![image](./screenshots/postman_17.png 'image')

Screenshot 1:

![image](./screenshots/postman_16.png 'image');

---
