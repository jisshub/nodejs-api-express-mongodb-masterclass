# logout to clear token cookie

**contollers/auth.js**

```javascript
// @desc - logout user, clear token cookie
// @route - GET /api/v1/auth/logout
// @access - Private

exports.logout = asyncHandler(async (req, res, next) => {
  // take the cookie and set it to none - set expiry after 10 secs.
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    // set cookie accessible to client side -> set httpOnly to true.
    httpOnly: true,
  });

  // send back the response
  res.status(200).json({
    success: true,
    data: {},
  });
});
```

**routes/auth.js**

```javascript
router.route('/logout').get(logout);
```
