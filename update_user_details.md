# Update User Details - name and email

- create a user updatedetails controller

**controllers/auth.js**

```javascript
// @desc - update user details
// @routes - PUT /api/v1/auth/updatedetails
// @access - Private
exports.updateUserDetails = asyncHandler(async (req, res, next) => {
  // set field to update
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  // find the user and update - validate
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  //   return response
  res.status(200).json({
    success: true,
    data: user,
  });
});
```

- set routes for this controller

**routes/auth.js**

```javascript
router.route('/updatedetails').put(protect, updateUserDetails);
```

### Screenshots:

#### Screenshot 1: Login First

![image](./screenshots/postman_22.png 'image')

#### Screenshot 2: create PUT request - give req.body

![image](./screenshots/postman_18.png 'image')

#### Screenshot 3: set Headers

![image](./screenshots/postman_19.png 'image')

#### Screenshot 4: set Authorization as _Bearer Token_

![image](./screenshots/postman_20.png 'image');

---

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

#### Screenshot 1: Login First

![image](./screenshots/postman_23.png 'image')

#### Screenshot 2: set PUT request here - give req.body

![image](./screenshots/postman14.png 'image')

#### Screenshot 3: set Headers

![image](./screenshots/postman_17.png 'image')

#### Screenshot 4: set Authorization as _Bearer Token_

![image](./screenshots/postman_16.png 'image');

---
