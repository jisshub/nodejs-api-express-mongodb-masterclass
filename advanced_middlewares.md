# using a middleware to do similar functionalities in various models

- Similar functionalities in diif controllers of Model are implemented in a middleare rather than repeating that same thing in controllers.

- create a middleware _advancedResults.js_

**middlewares/advancedResults.js**

```javascript
// define an advancedResult function
const advancedResult = (model, populate) => async (req, res, next) => {
  let query;
  //make a copy of req.query
  const reqQuery = {
    ...req.query,
  };

  // convert js object to json string.
  let queryStr = JSON.stringify(reqQuery);
  // gives,  {"averageCost":{"lte":"8000"}}

  // replace lte with $lte,
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // v concatenate with $ with matched value,

  // console.log(queryStr); // {"averageCost":{"$lte":"8000"}}

  // pass queryStr to query - parse it to js object
  query = model.find(JSON.parse(queryStr));

  // if there is something to populate
  if (populate) {
    query = query.populate(populate);
  }

  // executing the query
  const results = await query;

  // send back the response
  res.advancedResult = {
    success: true,
    count: results.length,
    data: results,
  };

  // move to next middleare
  next();
};

// export the function
module.exports = advancedResult;
```

---

**routes/bootcamp.js**

```javascript
// use advancedResult middleware to getBootcamps.
// pass Model, Populate as arguments
router.route('/').get(advancedResult(Bootcamp, 'courses'), getBootcamps);
```

---

**controllers/bootcamps.js**

```javascript
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // get response from advancedResult middleware.
  res.status(200).json(res.advancedResult);
});
```

---
