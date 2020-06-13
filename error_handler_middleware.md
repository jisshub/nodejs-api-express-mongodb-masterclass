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
    // use the  middleare
  }
};
```

- using middleware, we have to use, _app.use()_

**server.js**

```javascript
// use express router
app.use('/api/v1/bootcamps', bootcamps);

// use middleware erroHandler,
app.use(errorHandler);
```

## Mongoose Error Handling

**utils/errorResponse.js**

```javascript
// create a class that extends Error class
class ErrorResponse extends Error {
  // when instantiating the object takes two parameters
  constructor(message, statusCode) {
    //   call Error xlass constructor. use super() - pass message to it.
    super(message);
    this.statusCode = statusCode;
  }
}
// export this class
module.exports = ErrorResponse;
```

**middleware/error.js**

```javascript
const ErrorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
  // copy err and its properties to error variable
  let error = { ...err };

  // assign error message to error.message
  error.message = err.message;

  // if the id is not correct format/not found a resource with that id
  if (err.name === 'CastError') {
    // set an error message
    const message = `Resource with id ${err.value} is not found`;

    // instantiate errorRespose object
    error = new ErrorResponse(message, 404);
  }
  // finally return the response -> cliebnt wuth statucode.
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message,
  });
}

// export the erroHandler
module.exports = errorHandler;
```

**conrollers/bootcamps.js**

```javascript
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();

    res.status(200).json({
      success: true,
      count: bootcamps.length,
      data: bootcamps,
    });
  } catch (err) {
    // next middleware - middleware/error.js
    next(err);
  }
};

// @desc - get a bootcamps
// @access- public - no authentication required
// route - GET /api/v1/bootcamps/:id

exports.getSingleBootcamp = async (req, res, next) => {
  try {
    // use findById()
    const bootcamp = await Bootcamp.findById(req.params.id);
    // if no bootcamp exist, even though id is in correct format
    if (!bootcamp) {
      // call next middleware
      return next(
        new ErrorResponse(`Bootcamp with id ${req.params.id} is not found`)
      );
    } else {
      // send the response
      res.status(200).json({ success: true, data: bootcamp });
    }

    // if id is not in correct format / any other erros pops up.
  } catch (err) {
    next(err);
  }
};

// @desc - post a bootcamp
// @access- private - authentication required
// route - POST /api/v1/bootcamps

exports.createBootcamp = async (req, res, next) => {
  {
    try {
      // await for the Promise to get resolved
      const bootcamp = await Bootcamp.create(req.body);

      // send back the resposne - 201: since new resource created
      res.status(201).json({
        succes: true,
        data: bootcamp,
      });
      // if any error, catch the error
    } catch (err) {
      // call next middleware
      next(err);
    }
  }
};

// @desc - update a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.updateBootcamp = async (req, res, next) => {
  try {
    // set id, body, run mongoose validators on updated data
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    // if no bootcamp exist
    if (!bootcamp) {
      // return  next middleware if not found
      return next(
        new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });

    // if id is not in correct format / any other erros pops up.
  } catch (err) {
    next(err);
  }
};

// @desc - delete a bootcamp
// @access- private - authentication required
// route - PUT /api/v1/bootcamps/:id

exports.deleteBootcamp = async (req, res, next) => {
  try {
    // find the document and delete
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    // if id is in coorect format but no data found
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp with id ${req.params.id} not found`)
      );
    }
    // sent the response back
    res.status(200).json({ success: true, msg: 'data deleted' });

    // if id is not in correct format / any other erros pops up.
  } catch (err) {
    next(err);
  }
};
```

## mongoose error handling-part 2

```javascript
// mongoose duplicate field error- check using error code.
// console.log(err.code);
if (err.code === 11000) {
  const message = `Resource with name ${err.keyValue.name} already exist`;
  error = new ErrorResponse(message, 400);
}

// mongoose validation error - get err.name
// console.log(err.name);
if (err.name === 'ValidationError') {
  // get each error values
  const message = Object.values(err.errors);

  error = new ErrorResponse(message, 400);
}

// finally return the response -> client wuth statucode.
res.status(error.statusCode || 500).json({
  success: false,
  error: error.message,
});
```
