## custom error handler middleware

- create an _error.js_ file in _middleware_ dir.

**middleware/error.js**

```javascript
function errorHandler(err, req, res, next) {
  // send response to client
  res.status(500).json({
    success: false,
    error: err.message,
  });
}

// export the erroHandler
module.exports = errorHandler;
```

**controllers\bootcamps.js**

```javascript
exports.getSingleBootcamp = async (req, res, next) => {
  try {
    // use findById()
    const bootcamp = await Bootcamp.findById(req.params.id);
    // if no bootcamp exist
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    // send the response
    res.status(200).json({ success: true, data: bootcamp });

    // if any other errors in try block, catch here
  } catch (err) {
    // call next() and pass err.
    next(err);
    // if err, move to 'errorHandler' middleware
  }
};
```

- using middleware, we have to use, _app.use()_

**server.js**

```javascript
// use express router
app.use('/api/v1/bootcamps', bootcamps);

// always use errorHandler middleware below,
app.use(errorHandler);
```
